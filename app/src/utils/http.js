import router from '../routes/index';
import Axios from 'axios';

export default class Http {
  async get(endpoint, token) {
    try {
      const response = await Axios({
        method: 'get',
        url: `${router.options.apiUrl}/${endpoint}`,
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });

      await this.validateData(response);

      return response.data;
    } catch (err) {
      this.validateError(err);
      throw err;
    }
  }

  async post(endpoint, token = '', data) {
    try {
      const response = await Axios({
        method: 'post',
        url: `${router.options.apiUrl}/${endpoint}`,
        data,
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });

      await this.validateData(response);

      return response.data;
    } catch (err) {
      this.validateError(err);
      throw err;
    }
  }
  methodPostNotVerified(endpoint, token = '', data) {
    console.log(endpoint, token, data);
    return new Promise((resolve) => {
      fetch(`${router.options.apiUrl}/${endpoint}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(res => res.json())
        .then(json => {

          return resolve(json);
        });
    });
  }

  async delete(endpoint, token = '', id) {
    try {
      const response = await Axios({
        method: 'delete',
        url: `${router.options.apiUrl}/${endpoint}/${id}`,
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });

      await this.validateData(response);

      return response.data;
    } catch (err) {
      this.validateError(err);
      throw err;
    }
  }

  async update(endpoint, token = '', data, id) {
    try {
      const response = await Axios({
        method: 'put',
        url: `${router.options.apiUrl}/${endpoint}/${id}`,
        data,
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });

      this.validateData(response);

      return response.data;
    } catch (err) {
      this.validateError(err);
      throw err;
    }
  }

  async validateData(response) {
    try {
      if (!response) throw 'Ops, ocorreu um erro na hora de buscar os dados';

      if (response.status !== 200) throw 'Ops, ocorreu um erro na hora de buscar os dados';
    } catch (err) {
      throw err;
    }
  }

  validateError(err) {
    try {
      if (!err.response.data) return;
      if (!err.response.data.status) return;

      if (err.response.data.status === 401) {
        localStorage.removeItem('token');
        if (router.currentRoute.path === '/') return;
        router.replace('/');
      }
    } catch (err) {
      throw err;
    }
  }
}

