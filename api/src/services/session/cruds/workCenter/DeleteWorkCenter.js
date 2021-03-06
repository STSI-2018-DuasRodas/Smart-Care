const WorkCenterDao = require('../../../dao/cruds/WorkCenterDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class DeleteWorkCenter {
  constructor() {
    this._queryResult = '';
  }

  getParameters(req) {
    return {
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({ updateId, mysql, authData }) {
    return {
      ...(!updateId ? { numeroCracha: 'ID do centro de trabalho não infomado' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.validateGroups(parameters);
      await this.deleteWorkCenter(parameters);

      if (!this._queryResult.affectedRows)
        throw 'Não foi possível deletar o centro de trabalho';

      return this._queryResult;
    } catch (err) {
      console.log('err DeleteWorkCenter :>> ', err);

      throw err;
    }
  }

  async deleteWorkCenter(parameters) {
    this._queryResult = await new WorkCenterDao(parameters).deleteWorkCenter();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
