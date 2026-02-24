import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { employeeApi } from "../api/employeeApi";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", batch: "batch1", department: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Fetch all employees and match by email (mock auth)
      const res = await employeeApi.getAllEmployees();
      const found = res.data.data.find((emp) => emp.email === form.email);
      if (!found) {
        toast.error("Employee not found. Please register first.");
        return;
      }
      login(found);
      toast.success(`Welcome back, ${found.name}!`);
      navigate("/dashboard");
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await employeeApi.createEmployee(form);
      login(res.data.data);
      toast.success("Account created! Welcome 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">SB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Office Seat Booking</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your workspace efficiently</p>
        </div>

        <div className="card">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            {["login", "register"].map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize ${
                  mode === tab ? "bg-white shadow text-blue-600" : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  className="input-field"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                className="input-field"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <select name="batch" className="input-field" value={form.batch} onChange={handleChange}>
                    <option value="batch1">Batch 1 (Week1: Mon-Wed, Week2: Thu-Fri)</option>
                    <option value="batch2">Batch 2 (Week1: Thu-Fri, Week2: Mon-Wed)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    name="department"
                    className="input-field"
                    placeholder="Engineering"
                    value={form.department}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </span>
              ) : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
