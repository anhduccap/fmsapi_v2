const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}
