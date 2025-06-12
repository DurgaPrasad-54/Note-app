import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './note.css'

const Note = () => {
  const navigate = useNavigate();
  const Token = localStorage.getItem('Token')
  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetch('https://note-app-05gd.onrender.com/note', {
      headers: {
        "Authorization": `Bearer ${Token}`
      }
    }).then((res) => {
      return res.json()
    }).then((data) => {
      setNotes(data)
    }).catch((err) => {
      setNotes([])
    })
  }, [Token])

  if (!Token) {
    navigate('/login')
  }

  const handledel = (id) => {
    fetch(`https://note-app-05gd.onrender.com/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        
        setNotes(notes.filter(note => note._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="note-container"> 
      <div className="note-header">
        <h2 className="app-title">Note App</h2>
        <Link to={'/profile'} className="profile-link">Profile</Link>
      </div>

      {notes.length === 0 ? (
  <p style={{ textAlign: 'center', color: '#555', marginTop: '2rem' }}>
    No notes available
  </p>
) : (
  notes.map((note, index) => (
    <div key={index} className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-actions">
        <span className="date" > {note.createdAt && new Date(note.createdAt).toLocaleDateString('en-US', 
          {year: 'numeric',month: 'long',day:'numeric',hour:'2-digit',minute:"2-digit"}).replace(',', '')}</span>

        <button className="btn-sm delete-btn" onClick={() => handledel(note._id)}>Delete</button>
        <button className="btn-sm edit-btn" onClick={() => navigate(`/updatenote/${note._id}`)}>Edit</button>
      </div>
    </div>
  ))
)}


      <div className="floating-create">
        <Link to={'/createnote'}>+ New Note</Link>
      </div>
    </div>
  )
}

export default Note
