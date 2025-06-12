import './Form.css'
import {Link,useNavigate} from 'react-router-dom'
import { useState } from 'react'

const Login = () => {
  const navigate = useNavigate()
  const [data,setData] = useState({
    email:"",
    password:""
  })
  const [msg,setMsg] = useState({
    type:"",
    text:""
  })
  function handleinp(event){
    const {name,value} = event.target
    setData((prev)=>{
      return {...prev,[name]:value}
    })
  }
  function handlesub(e){
    e.preventDefault()
    fetch('http://127.0.0.1:8000/login',{
      method:"POST",
      body:JSON.stringify(data),
      headers:{
        "Content-Type":"application/json"
      }
    }).then((res)=>{
      return res.json()
    }).then((data)=>{
      if(data.Token){
        setMsg({type:'success',text:data.message})
        localStorage.setItem("Token",data.Token)
        setTimeout(()=>{
          navigate('/note')
        

        },2000)
      }
      else{
        setMsg({type:"error",text:data.message})
      }
      
    }).catch((err)=>{
      setMsg({type:"error",text:err.message})
    })

  }
  
  return (
        <div className='main'>
        <div className='inner'>
            <form className='form' onSubmit={handlesub}>
                <input className='inp' type="email" name="email" placeholder="Enter your email" value={data.email} onChange={handleinp} required    />
                <input className='inp' type="password" name="password" placeholder="Enter Your password" value={data.password} onChange={handleinp} required />
                <button className='btn' type="submit">JOIN</button>
                <p>Don't have an account <Link to={'/register'}>Register</Link></p>
            </form>
            <h1>{msg.text}</h1>
        </div>

        </div>


    
  )
}

export default Login