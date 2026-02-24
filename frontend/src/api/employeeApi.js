import axiosInstance from "./axiosInstance";

export const employeeApi = {
  createEmployee: (data) => axiosInstance.post("/employees", data),

  getAllEmployees: () => axiosInstance.get("/employees"),

  getEmployeeById: (id) => axiosInstance.get(`/employees/${id}`),

  updateEmployee: (id, data) => axiosInstance.put(`/employees/${id}`, data),

  deleteEmployee: (id) => axiosInstance.delete(`/employees/${id}`),
};
