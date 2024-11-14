import http from '../http-common';

export default class LocationService {
  constructor() {
    this.url = '/location';
  }

  async getStates() {
    try {
      const response = await http.get(`${this.url}/states`);
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }

  async getCities(stateId) {
    try {
      const response = await http.get(`${this.url}/cities/${stateId}`);
      return response.data;
    } catch (e) {
      throw e.response?.data || e;
    }
  }
}
