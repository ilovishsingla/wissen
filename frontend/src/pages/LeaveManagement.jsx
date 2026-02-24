import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { leaveApi } from "../api/leaveApi";
import { formatDate, formatDisplay } from "../utils/dateUtils";
import toast from "react-hot-toast";

const LEAVE_TYPES = ["casual", "sick", "personal", "other"];

const LeaveManagement = () => {
  const { employee } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ date: "", leaveType: "casual" });

  const now = new Date();
  const startDate = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
  const endDate = formatDate(new Date(now.getFullYear(), now.getMonth() + 2, 0));

  useEffect(() => {
    fetchLeaves();
  }, [employee]);

  const fetchLeaves = async () => {
    if (!employee) return;
    setLoading(true);
    try {
      const res = await leaveApi.getEmployeeLeaves(employee._id, startDate, endDate);
      setLeaves(res.data.data || []);
    } catch {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leaveApi.addLeave({ employeeId: employee._id, ...form });
      toast.success("Leave applied successfully!");
      setForm({ date: "", leaveType: "casual" });
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply leave");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await leaveApi.removeLeave(id);
      toast.success("Leave removed");
      fetchLeaves();
    } catch {
      toast.error("Failed to remove leave");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-500 text-sm mt-1">Apply for leave — your designated seat will be released automatically</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apply Leave Form */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Apply for Leave</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Date</label>
              <input
                type="date"
                className="input-field"
                min={formatDate(new Date())}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                className="input-field"
                value={form.leaveType}
                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
              >
                {LEAVE_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
              ℹ️ Applying for leave will automatically cancel existing bookings and release your designated seat for that day.
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Applying..." : "Apply Leave"}
            </button>
          </form>
        </div>

        {/* Leave History */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Leaves</h3>
            <span className="badge-occupied">{leaves.length} leaves</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">✅</p>
              <p>No leaves applied</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaves.map((leave) => (
                <div
                  key={leave._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
                      📋
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{formatDisplay(leave.date)}</p>
                      <p className="text-sm text-gray-500 capitalize">{leave.leaveType} Leave</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      leave.status === "approved" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {leave.status}
                    </span>
                    <button
                      onClick={() => handleDelete(leave._id)}
                      className="text-red-400 hover:text-red-600 text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
