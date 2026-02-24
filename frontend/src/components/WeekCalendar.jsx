import { getDayLabel, getDayNumber, formatDate, isWorkingDay } from "../utils/dateUtils";

const WeekCalendar = ({ weekDays, allocation, batch, onDayClick, selectedDate }) => {
  const getSeatsForDay = (date) => {
    const key = formatDate(date);
    return allocation?.[key] || [];
  };

  const getStats = (seats) => ({
    available: seats.filter((s) => s.status === "available").length,
    occupied: seats.filter((s) => s.status === "booked").length,
    total: seats.length,
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day) => {
        const seats = getSeatsForDay(day);
        const stats = getStats(seats);
        const isWorking = isWorkingDay(day, batch);
        const isSelected = formatDate(day) === selectedDate;
        const isToday = formatDate(day) === formatDate(new Date());

        return (
          <div
            key={day.toString()}
            onClick={() => isWorking && onDayClick?.(formatDate(day))}
            className={`
              rounded-xl border-2 p-3 transition-all
              ${isWorking ? "cursor-pointer hover:shadow-md" : "opacity-40 cursor-not-allowed"}
              ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white"}
              ${isToday ? "ring-2 ring-blue-300" : ""}
            `}
          >
            {/* Day Header */}
            <div className="text-center mb-3">
              <p className="text-xs font-medium text-gray-500">{getDayLabel(day)}</p>
              <p className={`text-xl font-bold ${isToday ? "text-blue-600" : "text-gray-800"}`}>
                {getDayNumber(day)}
              </p>
              {isWorking && (
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                  Working
                </span>
              )}
            </div>

            {/* Seat Stats */}
            {isWorking && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-gray-600">Free</span>
                  </div>
                  <span className="font-semibold text-green-600">{stats.available}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-gray-600">Taken</span>
                  </div>
                  <span className="font-semibold text-red-600">{stats.occupied}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-green-400 h-1.5 rounded-full transition-all"
                    style={{ width: stats.total > 0 ? `${(stats.available / stats.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            )}

            {!isWorking && (
              <p className="text-xs text-center text-gray-400 mt-2">Off Day</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeekCalendar;
