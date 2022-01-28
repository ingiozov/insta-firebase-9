import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBw8eVbbwZj_dVGAdPZ-oCrRWJydo68DO0',
  authDomain: 'instagram-01-538e5.firebaseapp.com',
  projectId: 'instagram-01-538e5',
  storageBucket: 'instagram-01-538e5.appspot.com',
  messagingSenderId: '769624735332',
  appId: '1:769624735332:web:7a8b458b1b82f7bbaae971',
}

const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)

export { db }
