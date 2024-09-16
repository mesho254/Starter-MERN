import { Route, Routes } from 'react-router-dom';
import './App.css';
import React, { lazy, Suspense } from "react";
import { Skeleton } from 'antd';
import 'antd/dist/reset.css';
import Navbar from './components/Layout/NavBar';
import { AuthProvider } from './contexts/AuthContexts';
import Footer from './components/Layout/Footer';


const HomePage = lazy(() => import('./pages/Home'));

const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'));
const SignUp = lazy(() => import('./pages/SignUp'));


const ErrorBoundary = lazy(() => import('./utils/ErrorBoundary'))

function App() {
  return (
    <AuthProvider>
    <div id="root">
    <div className="App" style={{ display: 'flex', flexDirection: 'column'}}>
      <>
      <Navbar/>
      <Suspense fallback={<div><div style={{ padding: '20px', margin: '100px auto', width: '100%' }}>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div></div>}>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/password-reset/:id/:token' element={<ResetPassword/>}/>

          <Route path='*' element={<ErrorBoundary/>}/>
        </Routes>
     </Suspense>
     <Footer/>
     </>
    </div>
    </div>
    </AuthProvider>
  );
}

export default App;
