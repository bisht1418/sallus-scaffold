const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

exports.connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoString, {
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}