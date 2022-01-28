import { useState, useEffect, useContext } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import FirebaseContext from '../context/firebase'

export default function useAuthListener() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')))
  const { db } = useContext(FirebaseContext)
  useEffect(() => {
    const auth = getAuth()
    const listener = onAuthStateChanged(auth, (authUser) => {
      // we have a user ... therefore we can store the user in localstorage
      if (authUser) {
        localStorage.setItem('authUser', JSON.stringify(authUser))
        setUser(authUser)
      } else {
        // we don't have authUser, therefore clear the localstorage
        localStorage.removeItem('authUser')
        setUser(null)
      }
    })

    return () => listener()
  }, [db])

  return { user }
}
