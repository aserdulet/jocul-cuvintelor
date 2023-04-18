import React, { useEffect, useState } from 'react'

import { db, auth } from '../../firebase';
import { collection, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth'

import { useNavigate } from 'react-router-dom'


import QuestionForm from '../questions/QuestionForm';
import Navbar from '../navbar/Navbar';

const Admin = () => {
    const [users, setUsers] = useState([])
    const usersCollectionRef = collection(db, 'users')
    const navigate = useNavigate()

    const updateUserRole = async (id, role) => {

        const userDoc = doc(db, 'users', id)

        const newFields = {
            role: role
        }

        await updateDoc(userDoc, newFields)

    }
    const handleLogout = () => {
      signOut(auth).
      then(()=> {
          navigate("/signin")
      }).
      catch((error)=> console.log(error))
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setUsers(data);
        });
    
        return () => unsubscribe();
      }, []);

  return (
    <div>
<div className="overflow-x-auto">
  <Navbar onLogout={handleLogout}/>
  <table className="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Id
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Email
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Location
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Role
        </th>
        <th className="px-6 py-3 bg-gray-50"></th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {users.map((user, key) => (
        <tr key={user.id}>
          <td className="px-6 py-4 whitespace-nowrap">{key + 1}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.displayName}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.photoURL}</td>
          <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              onClick={() => updateUserRole(user.id, 'admin')}
              className="text-blue-600 hover:text-blue-900 mr-2"
            >
              Make Admin
            </button>
            <button
              onClick={() => updateUserRole(user.id, 'user')}
              className="text-green-600 hover:text-green-900"
            >
              Make User
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        <br></br>
        <QuestionForm/>


    </div>
  )
}

export default Admin;


