const express = require('express');
const cors = require('cors');
const {setDefaultLanguage} = require('../cli/utils/language.utils')
const app = express();
app.use(express.json());
app.use(cors());

const router = require('./routes/index');
router(app);

const port = process.env.PORT

app.listen(port, () => {
    console.log('Default language to ', setDefaultLanguage())
    console.log('started at ', port)
});


module.exports = app;


