import { AuthProvider, useAuth } from './AuthContext'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'

function AppInner() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Dashboard /> : <LoginScreen />
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
