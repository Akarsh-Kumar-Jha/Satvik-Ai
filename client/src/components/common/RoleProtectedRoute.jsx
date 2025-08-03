import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

function RoleProtectedRoute({allowedRoles}) {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const user = useSelector((state) => state.auth.User);
    const userRole = user?.role;
    console.log("User Role -> ",userRole);

if(!isLoggedIn) return <Navigate to='/login' />
if(allowedRoles.includes(userRole)) return <Outlet/>;
else return <Navigate to='/unauthorized' />
}

export default RoleProtectedRoute