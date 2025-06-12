import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Register from './components/Register';
import Login from './components/Login'
import Note from './components/Note'
import Profile from './components/Profile'
import Createnote from './components/Createnote'

function App() {
  

  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/note' element={<Note/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="createnote" element={<Createnote/>}/>

    </Routes>
      
    </>
  )
}

export default App
