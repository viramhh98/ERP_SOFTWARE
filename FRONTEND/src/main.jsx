// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// import './main.css'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './main.css'
import { GoogleOAuthProvider } from '@react-oauth/google' // <-- 1. Import the provider

// 2. Grab your Client ID from your .env file
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 3. Wrap your App with the Provider */}
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)