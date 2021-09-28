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
  format.printf(
    info => `[${info.level.toUpperCase()}] ${info.timestamp} : ${info.message}`
  )
)

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), alignColorsAndTime),
      level: 'silly'
    })
  ]
})

export default logger
