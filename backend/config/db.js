const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/warranty_tracker';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`\n=============================================================`);
    console.error(`[MongoDB Connection Error] Failed to connect to local MongoDB database.`);
    console.error(`Target URI: ${mongoURI}`);
    console.error(`Error details: ${error.message}`);
    console.error(`-------------------------------------------------------------`);
    console.error(`Troubleshooting Steps:`);
    console.error(` 1. Ensure MongoDB service is running locally on your system.`);
    console.error(` 2. On Windows, check Services or run 'mongod' or 'net start MongoDB' in CMD.`);
    console.error(` 3. Check MONGODB_URI setting in backend/.env`);
    console.error(`=============================================================\n`);
  }
};

module.exports = connectDB;
