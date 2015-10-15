import Logger from 'bunyan';
import props from '../../../config/props';

let logger = new Logger({
  name: props.APP_NAME,
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    },
    {
      path: 'build/logs/node.console.log',
      level: 'trace'
    }
  ],
  serializers: {
    req: Logger.stdSerializers.req,
    res: Logger.stdSerializers.res
  }
});

export default logger;