import React from 'react'
import { NavLink } from 'react-router-dom'
export function TopBar() {
  return (
    <div>
        <div className="topbar-section">
            <div className="logo-block">
<img className="logo" src='../assets/logo.png' alt="alt" />
        <h1 className='text-bold h4'>Mero Store Dashbord</h1>
        <NavLink to="/">Sales</NavLink>
        <NavLink to="/products">Products</NavLink>
            </div>
        </div>

     
    </div>
  )
}


