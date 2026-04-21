import { AuthProvider, useAuth } from './context/AuthContext'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import './App.css'

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      {isAuthenticated ? <Dashboard /> : <LoginScreen />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
