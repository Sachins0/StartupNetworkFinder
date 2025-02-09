const mongoose = require('mongoose');
const serverConfig = require('./server-config');

const connectDB = async()=>{
   try {
    const connectionInstance =  await mongoose.connect(`${serverConfig.MONGODB_URI}`);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
   } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1)
   }
}

module.exports = connectDB;