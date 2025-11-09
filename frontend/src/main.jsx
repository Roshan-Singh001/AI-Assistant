import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'

import SimpleChat from './pages/SimpleChat.jsx';
import CodeEdit from './pages/CodeEdit.jsx';
import Tools from './pages/Tools.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import { ChatProvider } from './context/chatUnderstand.jsx';
import { ChatIndexProvider } from './context/chatIndex.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <App />
      </>
    ),
  },
  {
    path: "/tool/chat",
    element: (
      <>
        <ChatProvider>
          <ChatIndexProvider>
            <SimpleChat />
          </ChatIndexProvider>
        </ChatProvider>
      </>
    ),
  },
  {
    path: "/tool/code",
    element: (
      <>
        <CodeEdit />
      </>
    ),
  },
  {
    path: "/tools",
    element: (
      <>
        <Tools />
      </>
    ),
  },
  {
    path: "/contact",
    element: (
      <>
        <Contact />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <About />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <Register />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <ToastContainer style={{ fontFamily: `"Poppins", sans-serif` }} />
    <RouterProvider router={router} />
  </>
  // </StrictMode>,
)
