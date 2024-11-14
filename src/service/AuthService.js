import http from '../http-common';
import md5 from 'md5';

export default class AuthService {
  static async login(data) {
    data = Object.assign({}, data);
    if (!data.email || !data.password) throw { message: 'Email e senha são obrigatórios' };
    data.password = md5(data.password);
    try {
      const r = await http.post('/auth/login', data);
      return r.data;
    } catch (e) {
      throw e.response.data || e;
    }
  }

  static async register(data) {
    try {
      data = Object.assign({}, data);
      if (!data.email || !data.password) throw { message: 'Email e senha são obrigatórios' };
      data.password = md5(data.password);
      const r = await http.post('/auth/register', data);
      return r.data;
    } catch (e) {
      throw e.response.data || e;
    }
  }

  static async renewToken() {
    try {
      const r = await http.post('/auth/renew-token');
      return r.data;
    } catch (e) {
      throw e.response.data || e;
    }
  }

  static async google(data, role) {
    try {
      const r = await http.post('/auth/google', {
        tokens: data,
        Role: role,
      });
      return r.data;
    } catch (e) {
      throw e.response.data || e;
    }
  }
}
