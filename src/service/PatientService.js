import http from '../http-common';

export default class PatientService {
  constructor() {
    this.url = '/patient';
  }

  async getAll({ limit, offset, filter, sortBy, sortOrder }) {
    try {
      const response = await http.get(this.url, {
        params: {
          limit,
          offset,
          filter,
          sortBy,
          sortOrder,
        },
      });
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }

  async getById(id) {
    try {
      const response = await http.get(`${this.url}/${id}`);
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }

  async create(data) {
    try {
      const response = await http.post(this.url, data);
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }

  async update(id, data) {
    try {
      const response = await http.put(`${this.url}/${id}`, data);
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }

  async delete(id) {
    try {
      const response = await http.delete(`${this.url}/${id}`);
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }

  async deleteBulk(ids) {
    try {
      const response = await http.post(`${this.url}/delete/bulk`, { ids });
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }
}
