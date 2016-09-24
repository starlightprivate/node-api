import mongoose from 'mongoose';
import config from 'config3';

async function connectWithRetry () {
  try {
    // Auto-reconnect only works once we're connected
    await mongoose.connect(config.MONGO_URI, { server: { auto_reconnect:true } });
  }
  catch (err) {
    console.error('Failed to connect to mongo on startup - retrying in 5 sec', err.message);
    // Otherwise wee want to try again within a few seconds
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open on ${config.MONGO_URI}`);
});

mongoose.connection.on('error', err => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.error('Mongoose connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose.connection;