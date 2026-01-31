import React from "react";
import {useAuth} from "../context/AuthContext"
import { CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/system";


const ProtectedRoute = () => {
    const { isAuthenticated,loading}=useAuth();

    if(loading){
        return (
            <Box sx={{display:'flex', justifyContent:'center', alignItems:'center',minHeight:'100vh'}}>
                <CircularProgress/>
            </Box>
        )
    }

    if(!isAuthenticated){
          return <Navigate to="/login" replace/>
    }
      


  return <Outlet />;
}

export default ProtectedRoute;