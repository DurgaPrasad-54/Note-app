import { useEffect, useState } from 'react'
import {useNavigate,Link} from 'react-router-dom'
import './profile.css'

const Profile = () => {
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    username:"",email:""
  })
  const token = localStorage.getItem("Token")

  useEffect(() => {
    fetch(`${API_PATH}/profile`, {
      method:"GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfile({username:data.username,email:data.email})
      })
      .catch(err => {
        console.error("Error fetching profile:", err)
        setProfile(null)
      })
  }, [token])
  if(!token){
    navigate('/login')
  } 
  function handleclick(){
    localStorage.removeItem('Token')
    navigate('/login')


  }
  return (
    <div className="profile-page">
      <div className="pro-header">
        <h1 className="app-title">Note App</h1>
        <Link to={'/note'} className="home-link">Home</Link>

      </div>
      
    <div className='profile-container'>
      <h1>Profile</h1>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <button onClick={handleclick}>Logout</button>
    </div>
    </div>
    
  )
}

export default Profile
