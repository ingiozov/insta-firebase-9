import './wdyr'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import FirebaseContext from './context/firebase'
import { db } from './lib/firebase'
import './styles/app.css'
import 'react-loading-skeleton/dist/skeleton.css'

ReactDOM.render(
  <FirebaseContext.Provider value={{ db }}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root')
)
