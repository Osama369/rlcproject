import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // this is for routing 
import Homepage from './pages/Homepage';
// import Vouchersheet from './components/VoucherSheet';
import Login from './pages/login';
import Register from './pages/Register';

import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import ManageUsers from './pages/admin/ManageUsers';

// this is the routing setup 
function App() {
  return (
    <BrowserRouter>
      <Routes>
         {/* homepage will be protected route  */}
        <Route path="/" element={<Homepage />} />
          
          {/* public routes */}
         <Route path='login' element={<Login/>}></Route>
         <Route path='register' element={<Register/>}></Route>

         {/* admin routes */}
         <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
        </Route>

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
