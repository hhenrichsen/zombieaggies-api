//Logging
const winston = require('winston');

let alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all: true,
    }),
    winston.format.label({
        label: '[LOGGER]',
    }),
    winston.format.timestamp({
        format: "YY-MM-DD HH:MM:SS",
    }),
    winston.format.printf(
        info => `[${info.level.toUpperCase()}] ${info.timestamp} : ${info.message}`
    )
);

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
            level: 'silly',
        }),
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
        }),
    ],
});

module.exports = logger;