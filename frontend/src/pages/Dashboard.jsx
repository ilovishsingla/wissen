import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { bookingApi } from "../api/bookingApi";
import { seatApi } from "../api/seatApi";
import { leaveApi } from "../api/leaveApi";
import { formatDate, formatDisplay, getWeekDays, isWorkingDay } from "../utils/dateUtils";
import toast from "react-hot-toast";

const StatCard = ({ label, value, color, icon }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { employee } = useAuth();
  const [todayBooking, setTodayBooking] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [leaveCount, setLeaveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const todayStr = formatDate(today);

  useEffect(() => {
    const fetchData = async () => {
      if (!employee) return;
      try {
        // Today's booking
        const bookingsRes = await bookingApi.getEmployeeBookings(
          employee._id,
          todayStr,
          todayStr
        );
        const todayBook = bookingsRes.data.data.find(
          (b) => formatDate(b.date) === todayStr && b.status === "confirmed"
        );
        setTodayBooking(todayBook || null);

        // Available seats
        const seatsRes = await seatApi.getAvailableSeats(todayStr, employee.batch);
        setAvailableSeats(seatsRes.data.data || []);

        // Working days this week
        const weekDays = getWeekDays(today);
        const working = weekDays.filter((d) => isWorkingDay(d, employee.batch));
        setWorkingDays(working);

        // Leaves this month
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const leavesRes = await leaveApi.getEmployeeLeaves(
          employee._id,
          formatDate(start),
          formatDate(end)
        );
        setLeaveCount(leavesRes.data.data?.length || 0);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employee]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">Good {today.getHours() < 12 ? "Morning" : "Afternoon"}, {employee?.name?.split(" ")[0]}! 👋</h2>
        <p className="text-blue-100 mt-1">
          {formatDisplay(today)} • <span className="capitalize">{employee?.batch}</span>
        </p>
        {!isWorkingDay(today, employee?.batch) && (
          <div className="mt-3 bg-white/20 rounded-lg px-4 py-2 inline-block text-sm">
            📅 Today is your off day
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Booking" value={todayBooking ? "Booked ✓" : "Not Booked"} color={todayBooking ? "bg-green-100" : "bg-gray-100"} icon="🪑" />
        <StatCard label="Available Today" value={availableSeats.length} color="bg-blue-100" icon="🟢" />
        <StatCard label="Working Days (Week)" value={workingDays.length} color="bg-purple-100" icon="📅" />
        <StatCard label="Leaves This Month" value={leaveCount} color="bg-yellow-100" icon="📋" />
      </div>

      {/* Today's Booking Detail */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Status</h3>
        {todayBooking ? (
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-3xl">🪑</div>
            <div>
              <p className="font-semibold text-green-800">Seat Confirmed!</p>
              <p className="text-sm text-green-600">Seat #{todayBooking.seatId?.seatNumber} • {todayBooking.bookingType}</p>
              <p className="text-xs text-green-500 mt-1">Booking ID: {todayBooking._id}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-3xl">📭</div>
            <div>
              <p className="font-semibold text-gray-700">No booking for today</p>
              <p className="text-sm text-gray-500">Head to "Book a Seat" to reserve your spot</p>
            </div>
          </div>
        )}
      </div>

      {/* This Week's Schedule */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">This Week's Schedule</h3>
        <div className="grid grid-cols-7 gap-2">
          {getWeekDays(today).map((day) => {
            const isWorking = isWorkingDay(day, employee?.batch);
            const isToday = formatDate(day) === todayStr;
            return (
              <div
                key={day.toString()}
                className={`text-center p-2 rounded-lg border ${
                  isToday ? "bg-blue-600 text-white border-blue-600" :
                  isWorking ? "bg-green-50 border-green-200 text-green-800" :
                  "bg-gray-50 border-gray-100 text-gray-400"
                }`}
              >
                <p className="text-xs font-medium">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][day.getDay()]}</p>
                <p className="font-bold">{day.getDate()}</p>
                <p className="text-xs mt-1">{isWorking ? "Work" : "Off"}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
