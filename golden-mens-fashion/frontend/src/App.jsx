import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AuthProvider from './context/AuthProvider.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import AdminRoute from './components/AdminRoute.jsx'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import Landing from './pages/Landing.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/cart.jsx'
import Checkout from './pages/Checkout.jsx'
import About from './pages/AboutUs.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

import Dashboard from './pages/admin/Dashboard.jsx'
import ManageProducts from './pages/admin/ManageProducts.jsx'
import ManageOrders from './pages/admin/ManageOrders.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx'
import Orders from './pages/orders.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Navbar />

        <Routes>

          {/* PUBLIC */}
          <Route path="/"         element={<Landing />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED */}
          <Route path="/products"     element={<RequireAuth><Products /></RequireAuth>} />
          <Route path="/products/:id" element={<RequireAuth><ProductDetail /></RequireAuth>} />
          <Route path="/cart"         element={<RequireAuth><Cart /></RequireAuth>} />
          <Route path="/checkout"     element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />

          {/* ADMIN */}
          <Route path="/admin"          element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
          <Route path="/admin/orders"   element={<AdminRoute><ManageOrders /></AdminRoute>} />
          <Route path="/admin/users"    element={<AdminRoute><ManageUsers /></AdminRoute>} />

        </Routes>

        <Footer />

      </BrowserRouter>
    </AuthProvider>
  )
}