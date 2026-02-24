import axiosInstance from "./axiosInstance";

export const holidayApi = {
  addHoliday: (data) => axiosInstance.post("/holidays", data),

  removeHoliday: (id) => axiosInstance.delete(`/holidays/${id}`),

  getAllHolidays: () => axiosInstance.get("/holidays"),

  getHolidaysForMonth: (month, year) =>
    axiosInstance.get("/holidays/month", { params: { month, year } }),
};
