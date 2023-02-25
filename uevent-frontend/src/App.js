import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import MainPage from './pages/MainPage'
import Login from './pages/Login'
import Register from './pages/Register'
import EventPage from './pages/EventPage'
import UserPage from './pages/UserPage'
import Footer from './components/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <main>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/events/:id' element={<EventPage/>}/>
          <Route element = {<ProtectedRoute/>}>
            <Route path='/user-profile' element={<UserPage/>}/>
          </Route>
        </Routes>
        
      </main>
      <Footer/>
    </BrowserRouter>
  )
}