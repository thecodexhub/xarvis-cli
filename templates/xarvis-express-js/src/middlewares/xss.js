const xssFilters = require('xss-filters');

const clean = (rawData = '') => {
  let data = rawData;
  let isObject = false;

  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = xssFilters.inHTMLData(data).trim();
  if (isObject) data = JSON.parse(data);

  return data;
};

module.exports = function () {
  return (req, res, next) => {
    if (req.body) req.body = clean(req.body);
    if (req.query) req.query = clean(req.query);
    if (req.params) req.params = clean(req.params);

    next();
  };
};
