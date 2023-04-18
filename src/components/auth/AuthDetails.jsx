import React, {useEffect } from 'react'
import {auth} from '../../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

//redux
import { useSelector, useDispatch } from 'react-redux'
import { setAuthUser } from '../../store/authActions'

export default function AuthDetails() {
    
    const authUser = useSelector((state) => state.auth.authUser)
    const dispatch = useDispatch()

    useEffect(()=>{

        const listen = onAuthStateChanged(
            auth, (user) => {
                if (user) {
                    dispatch(setAuthUser(user))
                } else {
                    dispatch(setAuthUser(null))
                }
            }
        )

        return () => {
            listen();
        }

    }, [])

    const userSignOut = () => {
        signOut(auth)
        .then(()=> {
            console.log('Sign out successful')
        })
        .catch(error => console.log(error))
    }

  return (
    <div>
        {
            authUser ? 
            (
                <div>
                    <p>{`Signed In as ${auth.email}`}</p>
                    <button onClick={userSignOut}>Sign Out</button>     
                </div>
            )
            :
            (
                <div>This should be a redirect page. Is work in progress</div>
            )
        }
    </div>
  )
}
