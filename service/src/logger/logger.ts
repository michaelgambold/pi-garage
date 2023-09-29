import { ConsoleLogger, LoggerService } from '@nestjs/common';

export class Logger {
  private readonly logger: LoggerService;
  private readonly nodeEnv: string;

  constructor(loggerName?: string) {
    this.logger = new ConsoleLogger(loggerName);
    this.nodeEnv = process.env['NODE_ENV'];
  }

  error(message: unknown): void {
    if (this.nodeEnv === 'test') return;
    this.logger.error(message);
  }

  log(message: unknown): void {
    if (this.nodeEnv === 'test') return;
    this.logger.log(message);
  }

  warn(message: unknown): void {
    if (this.nodeEnv === 'test') return;
    this.logger.warn(message);
  }
}
