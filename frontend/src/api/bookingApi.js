import axiosInstance from "./axiosInstance";

export const bookingApi = {
  createBooking: (data) => axiosInstance.post("/bookings", data),

  cancelBooking: (id) => axiosInstance.put(`/bookings/${id}/cancel`),

  getEmployeeBookings: (employeeId, startDate, endDate) =>
    axiosInstance.get(`/bookings/employee/${employeeId}`, {
      params: { startDate, endDate },
    }),

  getBookingsForDate: (date) =>
    axiosInstance.get("/bookings/date", { params: { date } }),

  getAllBookings: () => axiosInstance.get("/bookings"),
};
