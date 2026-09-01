import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import LandingPage from './pages/landing-page'
import Login from './pages/login'
import Register from './pages/register'
import Shop from './pages/shop'
import { AppContext, useAppContext } from './services'
import SellItem from './pages/sell-item'
import ItemDetails from './pages/item-details'
import Layout from './pages/layout'
import SellerProfile from './pages/seller-profile'
import EditProfile from './pages/edit-profile'
import PurchaseHistory from './pages/purchase-history'
import SearchPage from './pages/search-page'
import NotFound from './pages/not-found'
import { Spinner } from './components/ui/spinner'
import MessagesInterface from './pages/messages'
import Profile from './pages/profile'
import Likes from './pages/likes'

{/* Reroutes to Login page if user is not logged in */}
function ProtectedRoute({children}: {children: React.ReactNode}){  
  const { user, authLoading } = useAppContext();
  
  if(authLoading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner/>
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<Layout/>}>
        <Route path="/" element={
          <LandingPage/>
        }/>

        <Route path='/shop' element={
          <Shop/>
        }/>

        <Route path='/users/:userId' element={
          <SellerProfile/>
        }/>

        <Route path='/item/:id' element={
          <ItemDetails/>
        }/>

        <Route path='/:username/' element={
          <Profile/>
        }/>

        <Route path='/:username/likes' element={
          <Likes/>
        }/>

        <Route path='/sell-item' element={
          <ProtectedRoute>
            <SellItem/>
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


        {/* For bare path no itemId and userId yet */}
        <Route path='/messages' element={
          <ProtectedRoute>
            <MessagesInterface/>
          </ProtectedRoute>
        }/>
        <Route path='/messages/:itemId/:userId' element={
          <ProtectedRoute>
            <MessagesInterface/>
          </ProtectedRoute>
        }/>
      </Route>
      

      <Route path='/search' element={
        <SearchPage/>
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
