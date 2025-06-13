import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './create.css'

const Createnote = () => {
    const API_PATH = import.meta.env.VITE_API_PATH;

    const Token  = localStorage.getItem("Token")
    const navigate = useNavigate()
    const [note,setNote] = useState({
        title:"",
        content:""
    })
    const [msg,setMsg]=useState({
        type:"",
        text:""
    })
    function handleinp(event){
        const {name,value}=event.target
        setNote((prev)=>{
            return {...prev,[name]:value}

        })
    }
    function handlesub(e){
        e.preventDefault()
        fetch(`${API_PATH}/createnote`,{
            method:"POST",
            body:JSON.stringify(note),
            headers:{
                "Authorization":`Bearer ${Token}`,
                "Content-Type":"application/json"
            }          
        }).then((res)=>{
            return res.json()
        }).then((data)=>{
            setMsg({type:"success",text:data.message})
            setTimeout(()=>{
                navigate('/note')
            }, 1000)
        }).catch((err)=>{
            setMsg({type:"error",text:err.message})
        })

    }

    
    
  return (
    <div className='main'>

        <div className='inner'>
            <form onSubmit={handlesub}>
                <h1 className='createh1'>Create Note</h1>
                <input className='cn' type='text' name='title' placeholder='Title' value={note.title} onChange={handleinp} required />
                <textarea className='cn' name="content" placeholder="Write your note here..." value={note.content} onChange={handleinp} required></textarea>
                <button type='submit'>Create Note</button>


            </form>
            <h1 className={msg.type === 'success' ? 'success' : msg.type === 'error' ? 'error' : ''}>{msg.text}</h1>

        </div>

    </div>
  )
}


export default Createnote