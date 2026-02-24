import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WeeklyAllocation from "./pages/WeeklyAllocation";
import SeatBooking from "./pages/SeatBooking";
import LeaveManagement from "./pages/LeaveManagement";
import AdminPanel from "./pages/AdminPanel";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  </div>
);

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/weekly-allocation" element={
          <ProtectedRoute>
            <Layout><WeeklyAllocation /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/book-seat" element={
          <ProtectedRoute>
            <Layout><SeatBooking /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/leaves" element={
          <ProtectedRoute>
            <Layout><LeaveManagement /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout><AdminPanel /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
