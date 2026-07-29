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
import SellerProfile from './pages/seller-profile'
import UserProfile from './pages/user-profile'
import EditProfile from './pages/edit-profile'
import PurchaseHistory from './pages/purchase-history'
import SearchPage from './pages/search-page'
import NotFound from './pages/not-found'

function ProtectedRoute({children}){  // Frontend protection for login bypass  
  const { user, authLoading } = useAppContext();
  if(authLoading){
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        AUTHLOADING
      </div>
    )
  }

  
  if(!user){
    return <Navigate to="/login" replace/>
  }
  return children

}










function AppRoute(){

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

        <Route path='/sell-item' element={
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

        <Route path='/users/:userId' element={
          <ProtectedRoute>
            <SellerProfile/>
          </ProtectedRoute>
        }/>

        <Route path='/user-profile' element={
          <ProtectedRoute>
            <UserProfile/>
          </ProtectedRoute>
        }/>

        <Route path='/edit-profile/:userId' element={
          <ProtectedRoute>
            <EditProfile/>
          </ProtectedRoute>
        }/>

        <Route path='/purchase-history' element={
          <ProtectedRoute>
            <PurchaseHistory/>
          </ProtectedRoute>
        }/>
      
      </Route>

      <Route path='/search' element={
        <ProtectedRoute>
          <SearchPage/>
        </ProtectedRoute> 
      }/>  
      
      <Route path='/chat/:itemId/:userId' element={
        <ProtectedRoute>
          <Chat/>
        </ProtectedRoute>
      }/>

      <Route path='*' element={
        <NotFound/>   // 404 Error page
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
