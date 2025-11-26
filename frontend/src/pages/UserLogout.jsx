import React from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

export const UserLogout = () => {
   const token = localStorage.getItem('token');
   const navigate =useNavigate();

   axios.get(`${import.meta.env.VITE_API_URL}/logout`,{
      headers :{
         Authentication: `Bearer ${token}`
      }
   }).then((response) =>{
      if(response.status === 201)
         navigate('/login')
   })
  return (
    <div>UserLogout</div>
  )
}

export default UserLogout;