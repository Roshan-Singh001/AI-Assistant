import React from 'react'
import {auth_client } from '../../utils/auth_client.jss'

const UserDashboard = () => {
    const {data: session} = auth_client.useSession();

  return (
    <>
     <div>User Dashboard</div>
    
    </>
  )
}

export default UserDashboard