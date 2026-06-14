import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import LandingPage from './pages/landing-page'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'
import { AppContext, useAppContext } from './context/context'
import SellItem from './pages/sell-item'
import ItemDetails from './pages/item-details'
import Layout from './pages/layout'


function ProtectedRoute({children}){  // Frontend protection for login bypass  
  const { user } = useAppContext();

  if(!user){
    return <Navigate to="/login" replace/>
  }
  return children

}

function App() {

  return (
    <>
      <AppContext>
        <BrowserRouter>
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

            </Route>
              
          </Routes>
        </BrowserRouter>
      </AppContext>
    </>
    
    
  )
}

export default App
