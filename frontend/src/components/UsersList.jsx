import React from 'react'
import PropTypes from 'prop-types'

export default function UsersList({ users }) {
  if (!users || users.length === 0) return <p>No users available.</p>

  return (
    <div className="users-list">
      {users.map((u) => (
        <article key={u.id || u._id || u.Username || u.username} className="user-card">
          <h4>{u.Username || u.username || u.name || u.displayName || 'User'}</h4>
          {u.Email && <p>{u.Email}</p>}
        </article>
      ))}
    </div>
  )
}

UsersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
}
