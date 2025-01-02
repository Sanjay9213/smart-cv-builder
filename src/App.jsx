import './App.css'
import Header from './components/custom/header';
import { Navigate, Outlet } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { useUser } from '@clerk/clerk-react';

function App() {
  const {isLoaded,isSignedIn}=useUser();

  if(!isSignedIn&&isLoaded)
  {
    return <Navigate to={'/auth/sign-in'} />
  }

  return (
    <>
      <Header/>
      <Outlet/>
      <Toaster />
    </>
  )
}

export default App
