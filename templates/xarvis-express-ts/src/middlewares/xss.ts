import { Request, Response, NextFunction } from 'express';
import xssFilters from 'xss-filters';

const clean = (rawData: any = ''): any | object => {
  let data: any = rawData;
  let isObject: boolean = false;

  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = xssFilters.inHTMLData(data).trim();
  if (isObject) data = JSON.parse(data);

  return data;
};

const xss = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.body) req.body = clean(req.body);
    if (req.query) req.query = clean(req.query);
    if (req.params) req.params = clean(req.params);

    next();
  };
};

export default xss;
