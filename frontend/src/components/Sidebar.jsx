import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/weekly-allocation", label: "Weekly View", icon: "📅" },
  { path: "/book-seat", label: "Book a Seat", icon: "🪑" },
  { path: "/leaves", label: "Leave Management", icon: "📋" },
  { path: "/admin", label: "Admin Panel", icon: "⚙️", adminOnly: true },
];

const Sidebar = () => {
  const { employee } = useAuth();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 min-h-screen py-6 px-4 hidden md:block">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.filter(item => !item.adminOnly || employee?.role === "admin").map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Seat Legend</p>
        <div className="flex flex-col gap-2">
          {[
            { color: "bg-green-400", label: "Available" },
            { color: "bg-red-400", label: "Occupied" },
            { color: "bg-blue-400", label: "Designated" },
            { color: "bg-yellow-400", label: "Flooder" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${color}`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
