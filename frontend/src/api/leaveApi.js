import axiosInstance from "./axiosInstance";

export const leaveApi = {
  addLeave: (data) => axiosInstance.post("/leaves", data),

  removeLeave: (id) => axiosInstance.delete(`/leaves/${id}`),

  getEmployeeLeaves: (employeeId, startDate, endDate) =>
    axiosInstance.get(`/leaves/employee/${employeeId}`, {
      params: { startDate, endDate },
    }),

  getAllLeaves: () => axiosInstance.get("/leaves"),
};
