import axiosInstance from "./axiosInstance";

export const seatApi = {
  getAllSeats: () => axiosInstance.get("/seats"),

  getSeatsByType: (type) => axiosInstance.get(`/seats/type/${type}`),

  getAvailableSeats: (date, batch) =>
    axiosInstance.get("/seats/available", { params: { date, batch } }),

  getWeeklyAllocation: (startDate, batch) =>
    axiosInstance.get("/seats/allocation/weekly", { params: { startDate, batch } }),

  initializeSeats: () => axiosInstance.post("/seats/initialize"),

  allocateDesignatedSeats: () => axiosInstance.post("/seats/allocate-designated"),
};
