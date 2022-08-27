const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}
