const COLOR_MAP = {
  available: "bg-green-100 border-green-300 hover:bg-green-200 text-green-800 cursor-pointer",
  occupied: "bg-red-100 border-red-300 text-red-800 cursor-not-allowed opacity-70",
  designated: "bg-blue-100 border-blue-300 text-blue-800 cursor-pointer hover:bg-blue-200",
  flooder: "bg-yellow-100 border-yellow-300 text-yellow-800 cursor-pointer hover:bg-yellow-200",
  blocked: "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50",
};

const SeatCard = ({ seat, onClick, selected }) => {
  const seatStatus = seat.status === "available" ? seat.type : seat.status;
  const colorClass = COLOR_MAP[seatStatus] || COLOR_MAP.available;

  return (
    <div
      onClick={() => seat.status !== "blocked" && seat.status !== "booked" && onClick?.(seat)}
      className={`
        relative border-2 rounded-lg p-2 text-center text-xs font-semibold transition-all select-none
        ${colorClass}
        ${selected ? "ring-2 ring-offset-1 ring-blue-500 scale-105" : ""}
      `}
      title={`Seat ${seat.seatNumber} - ${seat.type} - ${seat.status}`}
    >
      <div className="text-base mb-0.5">🪑</div>
      <div>{seat.seatNumber}</div>
      {selected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
};

export default SeatCard;
