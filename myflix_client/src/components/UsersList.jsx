import React, { useState } from 'react'
import PropTypes from 'prop-types'
import EditUserForm from './EditUserForm'

export default function UsersList({ users, selectedUser, onSelect, onDeleteUser, onUpdateUser }) {
    const [editingId, setEditingId] = useState(null)

    if (!users || users.length === 0) return <div>No users yet.</div>
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {users.map(u => (
                <div key={u._id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button onClick={() => onSelect(u)} style={{ textAlign: 'left', background: selectedUser && selectedUser._id === u._id ? '#def' : '#fff', flex: 1 }}>
                            {u.Username} ({u.Email})
                        </button>
                        <button onClick={() => { if (window.confirm('Delete this user?')) onDeleteUser && onDeleteUser(u._id) }} style={{ background: '#fdd' }}>Delete</button>
                        <button onClick={() => setEditingId(editingId === u._id ? null : u._id)}>{editingId === u._id ? 'Close' : 'Edit'}</button>
                    </div>
                    {editingId === u._id && (
                        <EditUserForm user={u} onCancel={() => setEditingId(null)} onSave={async (id, data) => { await onUpdateUser(id, data); setEditingId(null) }} />
                    )}
                </div>
            ))}
        </div>
    )
}

UsersList.propTypes = {
    users: PropTypes.array.isRequired,
    selectedUser: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
    onDeleteUser: PropTypes.func,
    onUpdateUser: PropTypes.func,
}
