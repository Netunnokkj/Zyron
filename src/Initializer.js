import Client from './Structures/Client.js';
import { config } from 'dotenv';

config({ path: './.env' });
const client = new Client();
client.init();

process.on('unhandledRejection', (reason, p) => {
  console.log('[ Anti-Crash ]');
  console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
  console.log('[ Anti-Crash ]');
  console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('[ Anti-Crash ]');
  console.log(err, origin);
});
