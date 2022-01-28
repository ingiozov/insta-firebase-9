import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import * as ROUTES from './constants/routes'
import useAuthListener from './hooks/use-auth-listener'
import UserContext from './context/user'

const Login = lazy(() => import('./pages/login'))
const Signup = lazy(() => import('./pages/signup'))
const Dashboard = lazy(() => import('./pages/dashboard'))
const Notfound = lazy(() => import('./pages/notfound'))

export default function App() {
  const { user } = useAuthListener()
  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </Suspense>
      </Router>
    </UserContext.Provider>
  )
}
