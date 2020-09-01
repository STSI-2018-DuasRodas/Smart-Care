import Axios from 'axios';
import Http from './http';
import moment from 'moment';

import { getToken } from '../utils/utils';
import store from '../store/index.js';

export default class Services extends Http {
  async setActivity(activityId, note) {
    try {
      const userInformation = {
        ...store.getters.getUser,
        date: moment().format('DD-MM-YYYY HH-mm'),
      };

      const response = await Axios({
        method: 'post',
        url: 'http://192.168.10.5:3010/activity/set',
        headers: {
          'authorization': `${getToken()}`,
        },
        data: { activityId, userInformation, note },
      });

      await this.validateData(response);

      return response.data;
    } catch (err) {
      console.log('err setActivity => :', err);
      this.validateError(err);
      throw err;
    }
  }

  async microserviceAnalisis(url, token) {
    try {
      const response = await Axios({
        method: 'get',
        url: `http://192.168.10.5:3020/${url}`,
        headers: {
          'authorization': `${token}`,
        },
      });

      await this.validateData(response);

      return response.data;
    } catch (err) {
      console.log('err analisis => :', err);
      this.validateError(err);
      throw err;
    }
  }
}