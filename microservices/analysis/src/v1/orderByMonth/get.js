const GetOrderByMonth = require('../../lib/session/GetOrderByMonth');

const getParameters = req => ({
  auth: req.headers.authorization || '',
});

const checkParameters = ({
  auth,
} = {}) => ({
  ...(!auth ? { auth: 'undefined' } : ''),
});

const run = async req => {
  try {
    const parameters = getParameters(req);

    const errs = checkParameters(parameters);
    if (Object.keys(errs).length > 0) throw errs;

    const response = await new GetOrderByMonth(parameters).run();

    return response;
  } catch (err) {
    console.log('err get => ', err);
    throw err;
  }
};

module.exports = {
  run,
};
