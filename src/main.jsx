import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'

import SimpleChat from './pages/SimpleChat.jsx';
import CodeEdit from './pages/CodeEdit.jsx';
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
  }
]);

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <ToastContainer style={{ fontFamily: `"Poppins", sans-serif` }} />
    <RouterProvider router={router} />
  </>
  // </StrictMode>,
)
