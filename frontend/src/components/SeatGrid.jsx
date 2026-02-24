import SeatCard from "./SeatCard";

const SeatGrid = ({ seats, onSeatClick, selectedSeatId }) => {
  const designatedSeats = seats.filter((s) => s.type === "designated");
  const flooderSeats = seats.filter((s) => s.type === "flooder");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Designated Seats ({designatedSeats.length})
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {designatedSeats.map((seat) => (
            <SeatCard
              key={seat._id}
              seat={seat}
              onClick={onSeatClick}
              selected={selectedSeatId === seat._id}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Flooder Seats ({flooderSeats.length})
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {flooderSeats.map((seat) => (
            <SeatCard
              key={seat._id}
              seat={seat}
              onClick={onSeatClick}
              selected={selectedSeatId === seat._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
