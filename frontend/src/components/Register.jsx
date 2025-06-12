
import {Link,useNavigate} from 'react-router-dom'
import { useState } from 'react'
import './logreg.css'

const Register = () => {
  const [data,setData] = useState({
    username:'',
    email:"",
    password:""
  })
  const [msg,setMsg]=useState({
    type:"",
    text:""
  })
  const navigate = useNavigate();
  function handleinp(event){
    const {name,value} = event.target
    setData((prev)=>{
      return {...prev,[name]:value}
    })
  }
  function handlesub(e){
    e.preventDefault()
    fetch('https://note-app-05gd.onrender.com/register',{
      method:"POST",
      body:JSON.stringify(data),
      headers:{
        "Content-Type":"application/json"
      }
    }).then((res)=>{
      return res.json()
    })
    .then((data)=>{
      console.log(data)
      setMsg({type:'success',text:data.message})
      setTimeout(()=>{
        
        navigate('/login')

      },1500)

    }).catch((err)=>{

      setMsg({type:"error",text:err.message})
      

    })
  }

  return (
        <div className='main'>
        <div className="inner">
            <form className="form" onSubmit={handlesub} >
                <input className='inp' type="text" name="username" placeholder="Enter User name" value={data.username} onChange={handleinp} required    />
                <input className='inp' type="email" name="email" placeholder="Enter your email" value={data.email} onChange={handleinp} required    />
                <input className='inp' type="password" name="password" placeholder="Enter Your password" min={6} value={data.password} onChange={handleinp} required />
                <button className="btn" type="submit">JOIN</button>
                <p>Already have an account <Link to={'/login'}>Login</Link></p>
                
            </form>
            <h1 className={msg.type === 'success' ? 'success' : msg.type === 'error' ? 'error' : ''}>{msg.text}</h1>

        </div>
        </div>
    
  )
}

export default Register