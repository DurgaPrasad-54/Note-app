import './Note.css'
import {useState,useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom'

const Note = () => {
  const navigate = useNavigate();
  const Token=localStorage.getItem('Token')
  const [notes,setNotes] = useState([])
  useEffect(()=>{
    fetch('http://127.0.0.1:8000/note',{
      headers:{
        "Authorization":`Bearer ${Token}`
      }
    }).then((res)=>{
      return res.json()
    }).then((data)=>{
      setNotes(data)
    }).catch((err)=>{
      setNotes([])
    })
  },[Token])
  if(!Token){
    navigate('/login')
  }
  const handledel = (id) => {
    fetch(`http://127.0.0.1:8000/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNotes(notes.filter(note => note._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='main'>
        <div className='header'>
            <h1>Note App</h1>
            <h1><Link to={'/profile'}>Profile</Link></h1>
        </div>
         {notes.map((note, index) => (
          <div key={index} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={()=>{handledel(note._id)}}>delete</button>
            <button onClick={() => navigate(`/updatenote/${note._id}`)}>edit</button>

          </div>
        
        ))}
        <div>
          <h3><Link to={'/createnote'}>New Note</Link></h3>
        </div>


    </div>
  )
}

export default Note