const express = require('express');
const {ServerConfig, connectDB} = require('./config');
const cors = require("cors");
const apiRoutes = require('./routes');
const CRON = require('./utils/common/cron-jobs')

const app = express();

app.use(cors({
    origin: ServerConfig.cors,
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api',apiRoutes);

connectDB()
.then(() => {

    app.on("errror", (error) => {
        console.log("Error in Server running: ", error);
        throw error
    })

    app.listen(ServerConfig.PORT || 5000, () => {
        console.log(`⚙ Server is running at port : ${ServerConfig.PORT}`);
        CRON();
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
