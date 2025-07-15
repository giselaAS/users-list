/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import styles from './Users.module.css'

function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState({})
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')       
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)  
        }
        const data = await response.json()
        if (data && data.length > 0) {
          setUsers(data)
          setFilteredUsers(data)
        } else {
          setError("A API retornou uma lista vazia ou dados inválidos.")
        }
      } catch (err) {
        setError(err.message || 'Ocorreu um erro desconhecido.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleUserClick = (user) => {
    setSelectedUser(user)
  }

  const performSearch = useCallback(() => {
    const currentSearchTerm = searchTerm.toLowerCase().trim()

    if (currentSearchTerm === '') {
      setFilteredUsers(users)
      setSelectedUser({})
      return
    }

    const filtered = users.filter(user => {
     const nameMatches = user.name.toLowerCase().startsWith(currentSearchTerm)

      return nameMatches
    })

    setFilteredUsers(filtered)

  }, [users, searchTerm])

  useEffect(() => {
    // Só executa se os usuários já foram carregados
    if (!loading && users.length > 0) {
      performSearch();
    }
  }, [searchTerm, users, loading, performSearch])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (filteredUsers.length > 0) {
        setSelectedUser(filteredUsers[0]); // Seleciona o primeiro item da lista filtrada
      } else {
        setSelectedUser({}); // Se não houver resultados, deseleciona
      }
    }
  }

  if (loading) {
    return <p style={{ color: 'white' }}>Carregando usuáios...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Erro ao carregar usuários: {error}</p>
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        <h1 className={styles.usersTitle}>Users List</h1>
          <input
          type="text"
          placeholder="Search by name"
          className={styles.searchInput} 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          /> 
        {filteredUsers.length === 0 && searchTerm !== '' ? (
          <p className={styles.noResultsMessage}>Nenhum usuário encontrado para "{searchTerm}".</p>
        ) : (
        <ul className={styles.userList}>
          {users.map(user => (
            <li key={user.id} 
            className={`${styles.userItem} ${selectedUser.id === user.id ? styles.activeUserItem : ''}`}
            onClick={() => handleUserClick(user)}>
              <p className={styles.userTextLeft}>{user.name}</p>
              <p className={styles.userTextRight}>{user.email}</p>
            </li>
          ))}
        </ul>
        )}
        {selectedUser.id && (
        <div className={styles.userDetails}>
          <h2>User Details</h2>
              <p className={styles.userDetailsItens}>Name: {selectedUser.name}</p>
              <p className={styles.userDetailsItens}>Email: {selectedUser.email}</p>
              <p className={styles.userDetailsItens}>City: {selectedUser.address?.city}</p>
        </div>
        )}
      </div>
    </div>
  );
}

export default UsersList;