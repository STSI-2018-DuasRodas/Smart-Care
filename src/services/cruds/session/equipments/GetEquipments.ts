import EquipmentsDao from '../../dao/crudModule/EquipmentsDao';

import { Connection } from 'mysql2/promise';
import { get } from 'lodash';

export default class GetEquipments {
  _queryResult: any

  constructor() {
    this._queryResult;
  }
  
  private getParameters = (req: { headers: any, mysql: Connection }): {
    mysql: Connection
  } => ({
    mysql: get(req, 'mysql'),
  })

  private checkParameters = ({ mysql }: { mysql: Connection }) => ({
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: { headers: any, mysql: Connection }) {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.getEquipments(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetEquipments :>> ', err);

      throw err;
    }
  }

  private async getEquipments(parameters: { mysql: Connection; }) {
    this._queryResult = await new EquipmentsDao(parameters).getEquipments();
  }
}
