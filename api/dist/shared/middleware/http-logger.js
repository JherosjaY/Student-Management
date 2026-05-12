/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { pinoHttp } from 'pino-http';
import { v7 as uuidv7 } from 'uuid';
import { logger } from '../utils/logger.js';

export const httpLogger = pinoHttp({
  logger,
  // Reuse request-id set by `requestId` middleware. If for some reason it
  // hasn't run, fall back to a fresh UUID v7 so log lines still correlate.
  genReqId: (req) => {
    const existing = req.id;
    return typeof existing === 'string' && existing.length > 0 ? existing : uuidv7();
  },
  customLogLevel: (_req, res, err) => {
    if (err !== undefined && err !== null) {
      return 'error';
    }
    if (res.statusCode >= 500) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
  // Skip access logs for liveness/readiness probes — they're noise.
  autoLogging: {
    ignore: (req) => req.url === '/health' || req.url === '/healthz',
  },
});