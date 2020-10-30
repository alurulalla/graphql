const mongoose = require('mongoose');

const connectDB = async () => {    try {
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
        });
        console.log(`Connected to MongoDB: ${con.connection.host}`);

    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;