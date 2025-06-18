import { useState, useEffect } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import './create.css';

const Update = () => {
  const API_PATH = import.meta.env.VITE_API_PATH;
  const { id } = useParams();
  const navigate = useNavigate();
  const Token = localStorage.getItem('Token');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState({
    type: '',
    text: ''
  });

  // Fetch current note details
  useEffect(() => {
    fetch(`${API_PATH}/note`, {
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
    fetch(`${API_PATH}/upnote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
      },
      body: JSON.stringify({ title, content })
    })
      .then(res => res.json())
      .then(data => {
        setMsg({ type: 'success', text: data.message });
        setTimeout(() => {
          navigate('/note');
        }, 1000);
        
      })
      .catch(err => {
        setMsg({ type: 'error', text: err.message });
      });
  };

  return (
    <div className='main' >
      <div className='inner'>
        <Link className='back' to='/note'><strong>back to home</strong></Link>
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
        <button className='btn' type="submit">Update Note</button>
      </form>
      <h1 className={msg.type === 'success' ? 'success' : msg.type === 'error' ? 'error' : ''}>{msg.text}</h1>
      </div>
      
    </div>
  );
};

export default Update;
