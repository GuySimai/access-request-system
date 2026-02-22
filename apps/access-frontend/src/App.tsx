import { useAuth } from './providers/AuthProvider';
import { LoginPage } from './modules/auth/LoginPage';
import { DashboardPage } from './modules/dashboard/DashboardPage';

function App() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return <DashboardPage />;
}

export default App;
