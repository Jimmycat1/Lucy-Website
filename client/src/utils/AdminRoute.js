
import {Route, Redirect} from 'react-router-dom';
import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import {LoadSignOn} from '../components/LoadSign';

const checkLoggedInAsAdmin = state => {
    if(state.auth.isAuthenticated){
        return true
    } else {
        return false
    }
}

const AdminRoute = ({children}, {...rest}) => {
    const loggedInAsAdmin = useSelector(state => state.isAuthenticated);
    const isLoading = useSelector(state => state.auth.isLoading);
    return <Route {...rest} render={()=>{
        if (isLoading){
            return (<LoadSignOn/>)
        } else {
            if (loggedInAsAdmin){
                return {children}
            } else {
                return (<Redirect to='/admin/login'/>)
            }
        }
    }}/>
}

export default AdminRoute;