/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { pinoHttp, type HttpLogger } from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

export const httpLogger: HttpLogger = pinoHttp({
  logger,
  // Reuse request-id set by `requestId` middleware. If for some reason it
  // hasn't run, fall back to a fresh UUID v7 so log lines still correlate.
  genReqId: (req) => {
    const existing = (req as { id?: unknown }).id;
    return typeof existing === 'string' && existing.length > 0 ? existing : uuidv4();
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
    req: (req: { id?: string; method: string; url: string; remoteAddress?: string }) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
  },
  // Skip access logs for liveness/readiness probes — they're noise.
  autoLogging: {
    ignore: (req) => req.url === '/health' || req.url === '/healthz',
  },
});