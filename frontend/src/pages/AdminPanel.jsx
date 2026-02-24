import { useEffect, useState } from "react";
import { seatApi } from "../api/seatApi";
import { bookingApi } from "../api/bookingApi";
import { employeeApi } from "../api/employeeApi";
import { leaveApi } from "../api/leaveApi";
import { holidayApi } from "../api/holidayApi";
import { formatDate, formatDisplay } from "../utils/dateUtils";
import SeatGrid from "../components/SeatGrid";
import toast from "react-hot-toast";

const TABS = ["Overview", "Employees", "Bookings", "Holidays"];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [seats, setSeats] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [holidayForm, setHolidayForm] = useState({ date: "", name: "", type: "national" });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [seatsRes, empRes, bookRes, holRes] = await Promise.all([
        seatApi.getAllSeats(),
        employeeApi.getAllEmployees(),
        bookingApi.getAllBookings(),
        holidayApi.getAllHolidays(),
      ]);
      setSeats(seatsRes.data.data || []);
      setEmployees(empRes.data.data || []);
      setBookings(bookRes.data.data || []);
      setHolidays(holRes.data.data || []);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleInitSeats = async () => {
    try {
      await seatApi.initializeSeats();
      toast.success("Seats initialized!");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to initialize seats");
    }
  };

  const handleAllocate = async () => {
    try {
      await seatApi.allocateDesignatedSeats();
      toast.success("Designated seats allocated!");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to allocate seats");
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    try {
      await holidayApi.addHoliday(holidayForm);
      toast.success("Holiday added!");
      setHolidayForm({ date: "", name: "", type: "national" });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add holiday");
    }
  };

  const handleRemoveHoliday = async (id) => {
    try {
      await holidayApi.removeHoliday(id);
      toast.success("Holiday removed");
      fetchAll();
    } catch {
      toast.error("Failed to remove holiday");
    }
  };

  const handleDeactivateEmployee = async (id) => {
    try {
      await employeeApi.deleteEmployee(id);
      toast.success("Employee deactivated");
      fetchAll();
    } catch {
      toast.error("Failed to deactivate employee");
    }
  };

  const seatStats = {
    total: seats.length,
    available: seats.filter((s) => s.status === "available").length,
    booked: seats.filter((s) => s.status === "booked").length,
    designated: seats.filter((s) => s.type === "designated").length,
    flooder: seats.filter((s) => s.type === "flooder").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">System overview and management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleInitSeats} className="btn-secondary text-sm">
            🔧 Init Seats
          </button>
          <button onClick={handleAllocate} className="btn-primary text-sm">
            🪑 Allocate Seats
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Seats", value: seatStats.total, color: "bg-gray-100" },
              { label: "Available", value: seatStats.available, color: "bg-green-100" },
              { label: "Booked", value: seatStats.booked, color: "bg-red-100" },
              { label: "Designated", value: seatStats.designated, color: "bg-blue-100" },
              { label: "Flooder", value: seatStats.flooder, color: "bg-yellow-100" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`card ${color} text-center`}>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-600 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">All Seats Overview</h3>
            <SeatGrid seats={seats} />
          </div>
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === "Employees" && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Employees ({employees.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Batch</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Designated Seat</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium">{emp.name}</td>
                    <td className="py-3 pr-4 text-gray-500">{emp.email}</td>
                    <td className="py-3 pr-4">
                      <span className="badge-designated capitalize">{emp.batch}</span>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{emp.department || "—"}</td>
                    <td className="py-3 pr-4">
                      {emp.designatedSeatId?.seatNumber
                        ? <span className="badge-available">{emp.designatedSeatId.seatNumber}</span>
                        : <span className="text-gray-400">Not assigned</span>}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleDeactivateEmployee(emp._id)}
                        className="text-red-400 hover:text-red-600 text-xs transition-colors"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "Bookings" && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Active Bookings ({bookings.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 pr-4">Employee</th>
                  <th className="pb-3 pr-4">Seat</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium">
                      {booking.employeeId?.name || "—"}
                    </td>
                    <td className="py-3 pr-4">{booking.seatId?.seatNumber || "—"}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDisplay(booking.date)}</td>
                    <td className="py-3 pr-4">
                      <span className={booking.bookingType === "flooder" ? "badge-flooder" : "badge-designated"}>
                        {booking.bookingType}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="badge-available">{booking.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Holidays Tab */}
      {activeTab === "Holidays" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Holiday</h3>
            <form onSubmit={handleAddHoliday} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={holidayForm.date}
                  onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Republic Day"
                  value={holidayForm.name}
                  onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="input-field"
                  value={holidayForm.type}
                  onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value })}
                >
                  {["national", "regional", "company"].map((t) => (
                    <option key={t} value={t} className="capitalize">{t}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">Add Holiday</button>
            </form>
          </div>

          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Holidays ({holidays.length})
            </h3>
            {holidays.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">🗓️</p>
                <p>No holidays added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {holidays.map((h) => (
                  <div
                    key={h._id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎉</span>
                      <div>
                        <p className="font-medium text-gray-800">{h.name}</p>
                        <p className="text-sm text-gray-500">{formatDisplay(h.date)} • {h.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveHoliday(h._id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
