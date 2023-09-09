import { ConsoleLogger, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const t0 = performance.now();

    res.on('close', () => {
      const t1 = performance.now();
      const msDuration = t1 - t0;

      const logger = new ConsoleLogger();

      let message = `${res.statusCode} ${req.method} ${req.path}`;

      if (req.method !== 'GET') {
        message += ` ${JSON.stringify(req.body)}`;
      }

      message += ` ${Math.round(msDuration)}ms`;

      logger.log(message);
    });

    next();
  }
}
