//Logging
import { format, createLogger, transports } from 'winston'

let alignColorsAndTime = format.combine(
  format.errors({ stack: true }),
  format.colorize({
    all: true
  }),
  format.label({
    label: '[WEB]'
  }),
  format.timestamp({
    format: 'YY-MM-DD HH:MM:SS'
  }),
  format.printf(info => {
    if (info instanceof Error) {
      return `[${info.level.toUpperCase()}] ${info.timestamp} : ${
        info.message
      } ${info.stack}`
    }
    return `[${info.level.toUpperCase()}] ${info.timestamp} : ${info.message}`
  })
)

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), alignColorsAndTime),
      level: 'silly'
    })
  ]
});

(logger as any).error = err => {
    if (err instanceof Error) {
      logger.log({ level: 'error', message: `${err.stack || err}` });
    } else {
      logger.log({ level: 'error', message: err });
    }
  };

export default logger
