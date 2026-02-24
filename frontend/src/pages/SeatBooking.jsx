import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { seatApi } from "../api/seatApi";
import { bookingApi } from "../api/bookingApi";
import SeatGrid from "../components/SeatGrid";
import { formatDate, formatDisplay, isWorkingDay } from "../utils/dateUtils";
import toast from "react-hot-toast";

const SeatBooking = () => {
  const { employee } = useAuth();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  const isAfter3PM = new Date().getHours() >= 15;

  useEffect(() => {
    if (selectedDate) fetchAvailableSeats();
  }, [selectedDate]);

  const fetchAvailableSeats = async () => {
    setLoading(true);
    setSelectedSeat(null);
    try {
      const res = await seatApi.getAvailableSeats(selectedDate, employee?.batch);
      setAvailableSeats(res.data.data || []);
    } catch {
      toast.error("Failed to load available seats");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSeat) return toast.error("Please select a seat first");

    const bookingDate = new Date(selectedDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Flooder seat check
    if (selectedSeat.type === "flooder") {
      const isTomorrow = formatDate(bookingDate) === formatDate(tomorrow);
      if (!isTomorrow || !isAfter3PM) {
        return toast.error("Flooder seats can only be booked after 3 PM for the next day");
      }
    }

    setBooking(true);
    try {
      await bookingApi.createBooking({
        employeeId: employee._id,
        seatId: selectedSeat._id,
        date: selectedDate,
        bookingType: selectedSeat.type,
      });
      toast.success(`Seat ${selectedSeat.seatNumber} booked successfully! 🎉`);
      setSelectedSeat(null);
      fetchAvailableSeats();
    } catch (err) {
      toast.error(err.response?.data?.error || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const isSelectedDateWorkingDay = isWorkingDay(new Date(selectedDate), employee?.batch);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book a Seat</h1>
        <p className="text-gray-500 text-sm mt-1">Select a date and choose your preferred seat</p>
      </div>

      {/* Date Picker & Info */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              className="input-field max-w-xs"
              value={selectedDate}
              min={formatDate(new Date())}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {selectedDate && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isSelectedDateWorkingDay
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {isSelectedDateWorkingDay ? "✅ Working Day" : "❌ Off Day — No Booking"}
            </div>
          )}
        </div>

        {/* Flooder seat warning */}
        {!isAfter3PM && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Flooder seats can only be booked after <strong>3:00 PM</strong> for the next day.
            Current time: {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Seat Selection */}
      {isSelectedDateWorkingDay && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Available Seats — {formatDisplay(selectedDate)}
            </h3>
            <span className="text-sm text-gray-500">{availableSeats.length} seats available</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <SeatGrid
              seats={availableSeats}
              onSeatClick={setSelectedSeat}
              selectedSeatId={selectedSeat?._id}
            />
          )}
        </div>
      )}

      {/* Booking Summary */}
      {selectedSeat && (
        <div className="card border-2 border-blue-300 bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Booking Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <span className="text-gray-500">Seat Number:</span>
              <span className="ml-2 font-semibold text-gray-800">{selectedSeat.seatNumber}</span>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <span className={`ml-2 font-semibold capitalize ${
                selectedSeat.type === "flooder" ? "text-yellow-700" : "text-blue-700"
              }`}>{selectedSeat.type}</span>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>
              <span className="ml-2 font-semibold text-gray-800">{formatDisplay(selectedDate)}</span>
            </div>
            <div>
              <span className="text-gray-500">Employee:</span>
              <span className="ml-2 font-semibold text-gray-800">{employee?.name}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleBooking} disabled={booking} className="btn-primary">
              {booking ? "Confirming..." : "Confirm Booking ✓"}
            </button>
            <button onClick={() => setSelectedSeat(null)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatBooking;
