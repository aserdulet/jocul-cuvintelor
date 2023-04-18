import React, { useState, useEffect } from 'react'
import {auth} from '../../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import Navbar from '../navbar/Navbar'

function HomePage() {

  const navigate = useNavigate()
  
  const handleLogout = () => {
    signOut(auth).
    then(()=> {
        navigate("/signin")
    }).
    catch((error)=> console.log(error))
  }
  return (
    <div className="min-h-screen flex flex-col w-300" >
      <Navbar onLogout={handleLogout} />
      <main className="container mx-auto flex-grow flex items-center justify-center">
        <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">
            Home
          </h1>
          {/* Your other content goes here */}
        </div>
      </main>
    </div>
  );
}

export default HomePage