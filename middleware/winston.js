const { transports, createLogger, format } = require('winston');
const { combine, timestamp, prettyPrint } = format;


const winston = createLogger({
    level: "debug",
    format: combine(
        timestamp({
            format: "DD-MM-YYYY HH:mm:ss"
        }),
        prettyPrint()
    ),
    transports:[
        new transports.Console(),
        new transports.File({filename: "logs.log"})

    ]
    

})

module.exports = winston;