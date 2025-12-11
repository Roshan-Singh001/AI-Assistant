import React from 'react';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authClient } from '../utils/auth_client';
import AccessDenied from './AccessDenied';

const PrivateRoute = () => {
  const {data: session} = authClient.useSession();

//   if (loading) {
//     return(
//       <>
//         <PixelPenLoader/>
//       </>
//     )
//   }

  if (!session) {
    return <AccessDenied/>;
  }

  return <Outlet />;
};

export default PrivateRoute;