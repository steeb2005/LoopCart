import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import LandingPage from './pages/landing-page'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'
import { AppContext, useAppContext } from './context/context'
import SellItem from './pages/sell-item'
import ItemDetails from './pages/item-details'
import Layout from './pages/layout'
import LikedItems from './pages/liked-items'
import Inbox from './pages/inbox'
import Chat from './pages/chat'

function ProtectedRoute({children}){  // Frontend protection for login bypass  
  const { user, loading } = useAppContext();
  if(loading){

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Page loading...</div>
      </div>
    )
  }
  
  if(!user){
    return <Navigate to="/login" replace/>
  }
  return children

}

function AppRoute(){
  const {loading} = useAppContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-primary-text">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bg-inverse mx-auto"></div>
          <p className="mt-4 text-xl">Loading your page...</p>
        </div>
      </div>
    );
  }

  return(
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout/>}>
        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>

        <Route path='/sellItem' element={
          <ProtectedRoute>
            <SellItem/>
          </ProtectedRoute>
        }/>

        <Route path='/item/:id' element={
          <ProtectedRoute>
            <ItemDetails/>
          </ProtectedRoute>
        }/>

        <Route path='/liked-items' element={
          <ProtectedRoute>
            <LikedItems/>
          </ProtectedRoute>
        }/>


        <Route path='/inbox' element={
          <ProtectedRoute>
            <Inbox/>
          </ProtectedRoute>
        }/>

      </Route>
      <Route path='/chat/:itemId/:userId' element={
          <ProtectedRoute>
            <Chat/>
          </ProtectedRoute>
        }/>
    </Routes>
  )
}




function App() {  
  return (
    <>
      <AppContext>
        <BrowserRouter>
          <AppRoute/>
        </BrowserRouter>
      </AppContext>
    </>
    
    
  )
}

export default App
