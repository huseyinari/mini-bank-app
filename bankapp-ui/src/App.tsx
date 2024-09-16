import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import RegisterPage from "./pages/Register";
import LoginPage from './pages/Login';
import AccountsPage from './pages/Accounts';
import { setAxiosInterceptors } from './config/AxiosConfig';
import CreateAccountPage from './pages/CreateAccount';
import EditAccountPage from './pages/EditAccount';
import TransferMoneyPage from './pages/TransferMoney';

function App() {
  setAxiosInterceptors();

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/accounts/new' element={<CreateAccountPage />} />
        <Route path='/accounts/:id' element={<EditAccountPage />} />
        <Route path='/accounts' element={<AccountsPage />} />
        <Route path='/transfer' element={<TransferMoneyPage />} />
      </Routes>
    </>
  )
}

export default App
