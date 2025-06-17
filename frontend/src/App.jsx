import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Note from './components/Note';
import Profile from './components/Profile';
import Createnote from './components/Createnote';
import Update from './components/Update';
import Forgetpass from './components/Forgetpass';
import Newpass from './components/Newpass';

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
      <Route path="/updatenote/:id" element={<Update />} />
      <Route path='/forgetpassword' element = {<Forgetpass/>}/>
      <Route path='/newpassword' element = {<Newpass />} />
      <Route path='*' element={<h1>404 - Page Not Found</h1>} />

    </Routes>
      
    </>
  )
}

export default App
