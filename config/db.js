// DB Setup
const mongoose = require("mongoose");
const { DB_URI_DEV } = require("./secret");

// db Connection
mongoose.connect(DB_URI_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.dir("Connected to Database"))
    .catch((err) => console.warn(err));
