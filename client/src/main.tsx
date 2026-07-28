import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='821361111216-h33sahs038r9jkll60vj8jcg4mkkn84d.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
