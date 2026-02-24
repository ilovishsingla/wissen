import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { seatApi } from "../api/seatApi";
import WeekCalendar from "../components/WeekCalendar";
import SeatGrid from "../components/SeatGrid";
import { getWeekDays, formatDate, getMonthYear, formatDisplay } from "../utils/dateUtils";
import { addDays, subDays } from "date-fns";
import toast from "react-hot-toast";

const WeeklyAllocation = () => {
  const { employee } = useAuth();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  });
  const [allocation, setAllocation] = useState({});
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedDaySeats, setSelectedDaySeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekDays = getWeekDays(currentWeekStart);

  useEffect(() => {
    fetchAllocation();
  }, [currentWeekStart, employee]);

  const fetchAllocation = async () => {
    if (!employee) return;
    setLoading(true);
    try {
      const res = await seatApi.getWeeklyAllocation(formatDate(currentWeekStart), employee.batch);
      setAllocation(res.data.data || {});
    } catch {
      toast.error("Failed to fetch weekly allocation");
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setSelectedDaySeats(allocation[dateStr] || []);
  };

  const goToPrevWeek = () => setCurrentWeekStart((d) => subDays(d, 7));
  const goToNextWeek = () => setCurrentWeekStart((d) => addDays(d, 7));

  const stats = selectedDaySeats.reduce(
    (acc, seat) => {
      acc[seat.status] = (acc[seat.status] || 0) + 1;
      if (seat.type === "flooder") acc.flooder++;
      return acc;
    },
    { available: 0, booked: 0, flooder: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Seat Allocation</h1>
          <p className="text-gray-500 text-sm mt-1">{getMonthYear(currentWeekStart)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goToPrevWeek} className="btn-secondary px-3 py-2">← Prev</button>
          <button
            onClick={() => setCurrentWeekStart(new Date())}
            className="btn-primary px-3 py-2 text-sm"
          >
            Today
          </button>
          <button onClick={goToNextWeek} className="btn-secondary px-3 py-2">Next →</button>
        </div>
      </div>

      {/* Week Calendar */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <WeekCalendar
          weekDays={weekDays}
          allocation={allocation}
          batch={employee?.batch}
          onDayClick={handleDayClick}
          selectedDate={selectedDate}
        />
      )}

      {/* Selected Day Seat Grid */}
      {selectedDate && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {formatDisplay(selectedDate)}
              </h3>
              <p className="text-sm text-gray-500">Seat availability breakdown</p>
            </div>
            {/* Mini stats */}
            <div className="flex gap-3">
              <span className="badge-available">✅ {stats.available} Free</span>
              <span className="badge-occupied">🔴 {stats.booked} Taken</span>
              <span className="badge-flooder">🟡 {stats.flooder} Flooder</span>
            </div>
          </div>

          {selectedDaySeats.length > 0 ? (
            <SeatGrid seats={selectedDaySeats} />
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p>No seat data available for this day</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyAllocation;
