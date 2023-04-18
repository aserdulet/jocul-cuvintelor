import React from 'react'
import './App.css'

//components
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import AuthDetails from './components/auth/AuthDetails'
import HomePage from './components/home/HomePage'
import Admin from './components/admin/Admin'

//store
import store from './store'

//third party
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';


function App() {


  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path='/home' element={<HomePage/>} />
          <Route path='/admin' element={<Admin/>} />
          <Route path="/" element={<AuthDetails/>} />
        </Routes>
      </Router>
    </Provider>
  )


}

export default App
