const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const router = require('./routes/index');
router(app);

const port = process.env.PORT

app.listen(port, () => {
    console.log('started at ', port)
});


module.exports = app;


