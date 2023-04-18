import React, {useState} from 'react'
import {db, auth} from '../../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {setDoc, doc, getDoc} from 'firebase/firestore'

import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const navigate = useNavigate()

    const locations = [
        'Pitesti',
        'Craiova',
        'Brasov',
        'Sibiu',
        'Timisoara',
      ];

    const storeUserData = async (user) => {
        const userRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(userRef)

        if (!docSnap.exists()) {
            await setDoc(userRef, {
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email,
                id: user.uid,
                role: "user"
            })
        }

    }
    const signUp = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password)
        .then((useCredentials) => {
            updateProfile(useCredentials.user, {
                displayName: name,
                photoURL: location
            }).then(()=> {
                storeUserData(useCredentials.user)
                .then(()=>{
                    navigate('/signin')
                })
                .catch(error => console.log('error', error))
            }).catch(error => console.log('updating user profile', error))
        })
        .catch(error => console.log('error', error))
    }


    return (
<div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8 h-full bg-white p-16">
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-800">
        Create Account
      </h2>
    </div>
    <form className="mt-8 space-y-6" onSubmit={signUp}>
      <input type="hidden" name="remember" defaultValue="true" />
      <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-8">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="location" className="sr-only">
            Location
          </label>
          <select
            id="location"
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="" disabled>
              Select your location
            </option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400'
>
          Sign Up
        </button>
        </div>
        </form>
        <div className="mt-4">
            <button
              type="button"
              className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
              onClick={() => {
                navigate("/signin");
              }}
            >
              Already have an account?
            </button>
          </div>
        </div>

        
        </div>
    )
}

export default SignUp