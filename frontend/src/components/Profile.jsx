import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    username:"",email:""
  })
  const token = localStorage.getItem("Token")

  useEffect(() => {
    fetch('http://127.0.0.1:8000/profile', {
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
  function handleclick(){
    localStorage.removeItem('Token')
    navigate('/login')


  }
  return (
    <div className='profile-container'>
      <h1>Profile</h1>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <button onClick={handleclick}>Logout</button>
    </div>
  )
}

export default Profile
