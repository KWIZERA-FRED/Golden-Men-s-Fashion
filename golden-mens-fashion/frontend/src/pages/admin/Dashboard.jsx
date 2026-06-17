import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../context/useAuth'
import '../../styles/admin/admin.css'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts"

import {
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaMoneyBillWave
} from "react-icons/fa"

// --- Constants ---
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

export default function Dashboard() {
  // --- Hooks & Navigation ---
  const { token, user } = useAuth()
  const navigate = useNavigate()

  // --- State Hooks ---
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0
  })

  const [charts, setCharts] = useState({
    orders: [],
    products: [],
    revenue: []
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // --- Side Effects ---
  useEffect(() => {
    if (!token) return

    const loadDashboard = async () => {
      try {
        setLoading(true)
        
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }

        // Fetch Stats
        const statsRes = await fetch(`${API_URL}/admin/stats`, {
          method: "GET",
          headers
        })
        if (!statsRes.ok) throw new Error("Unable to load dashboard statistics")
        const statsData = await statsRes.json()

        // Fetch Charts
        const chartsRes = await fetch(`${API_URL}/admin/stats/charts`, {
          method: "GET",
          headers
        })
        if (!chartsRes.ok) throw new Error("Unable to load dashboard charts")
        const chartsData = await chartsRes.json()

        // Update State
        setStats(statsData)
        setCharts(chartsData)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [token])

  // --- Memoized Configuration Data ---
  const cards = useMemo(() => [
    {
      label: "Total Users",
      value: stats.total_users,
      icon: <FaUsers />,
      path: "/admin/users"
    },
    {
      label: "Total Products",
      value: stats.total_products,
      icon: <FaBoxOpen />,
      path: "/admin/products"
    },
    {
      label: "Total Orders",
      value: stats.total_orders,
      icon: <FaClipboardList />,
      path: "/admin/orders"
    },
    {
      label: "Revenue",
      value: `RWF ${Number(stats.total_revenue).toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      path: "/admin/orders"
    }
  ], [stats])

  // --- Early Return: Loading State ---
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  // --- Render ---
  return (
    <div className="admin-page">
      
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && <div className="admin-error">{error}</div>}

      {/* STAT CARDS GRID */}
      <div className="dashboard-grid">
        {cards.map((card) => (
          <div
            key={card.label}
            className="stat-card"
            onClick={() => navigate(card.path)}
          >
            <div className="stat-icon">{card.icon}</div>
            <div>
              <p className="stat-label">{card.label}</p>
              <p className="stat-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS CONTAINER */}
      <div className="charts-container">
        
        {/* PIE CHART: ORDERS STATUS */}
        <div className="chart-card">
          <h2>Orders Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.orders}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {charts.orders.map((item, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART: PRODUCT CATEGORIES */}
        <div className="chart-card">
          <h2>Products Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.products}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART: REVENUE TRENDS */}
        <div className="chart-card revenue-chart">
          <h2>Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.revenue}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* QUICK SHORTCUT ACTIONS */}
      <div className="dashboard-shortcuts">
        <h2>Quick Actions</h2>
        <div className="shortcut-grid">
          <button onClick={() => navigate("/admin/products")}>+ Add Product</button>
          <button onClick={() => navigate("/admin/orders")}>View Orders</button>
          <button onClick={() => navigate("/admin/users")}>Manage Users</button>
        </div>
      </div>

    </div>
  )
}