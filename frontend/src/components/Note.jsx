import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './note.css'


const Note = () => {
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();
  const Token = localStorage.getItem('Token')
  const [notes, setNotes] = useState([])

  useEffect(() => {
    if (!Token) {
      navigate('/login');
      return;
    }

    fetch(`${API_PATH}/note`, {
      headers: {
        "Authorization": `Bearer ${Token}`
      }
    }).then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch notes');
      }
      return res.json();
    }).then(data => {
      setNotes(data);
    }).catch(err => {
      console.error(err);
      setNotes([]);
    });
  }, [Token, navigate])

  const handledel = (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    fetch(`${API_PATH}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Token}`
      }
    })
      .then((res) =>{
        return res.json()})
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
        notes.map(note => (
          <div key={note._id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="note-actions">
              <span className="date">
                {note.createdAt && new Date(note.createdAt).toLocaleDateString('en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: "2-digit"
                  }).replace(',', '')}
              </span>

              <button className="btn-sm delete-btn" onClick={() => handledel(note._id)}>Delete</button>
              <button className="btn-sm edit-btn" onClick={() => navigate(`/updatenote/${note._id}`)}>Edit</button>
            </div>
          </div>
        ))
      )}

      <div className="floating-create">
        <Link className='btn' to={'/createnote'}>+ New Note</Link>
      </div>
    </div>
  )
}

export default Note
