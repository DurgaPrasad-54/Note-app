import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './create.css';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const Token = localStorage.getItem('Token');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch current note details
  useEffect(() => {
    fetch('http://127.0.0.1:8000/note', {
      headers: {
        'Authorization': `Bearer ${Token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const existingNote = data.find(note => note._id === id);
        if (existingNote) {
          setTitle(existingNote.title);
          setContent(existingNote.content);
        }
      })
      .catch((err) => {
        console.error('Error fetching note:', err);
      });
  }, [id, Token]);

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/upnote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
      },
      body: JSON.stringify({ title, content })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        navigate('/note');
      })
      .catch(err => {
        console.error('Error updating note:', err);
      });
  };

  return (
    <div className='main' >
      <div className='inner'>
      
      <form onSubmit={handleUpdate}>
        <h1 className='createh1'>Update Note</h1>
        <input
          className='cn'
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className='cn'
          rows="5"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Update Note</button>
      </form>
      </div>
    </div>
  );
};

export default Update;
