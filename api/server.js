const express = require('express');
const cors = require('cors');
const {setDefaultLanguage,loadLanguage} = require('../cli/utils/language.utils')
const {loadConfig} = require('./utils/config.utils')

const app = express();
app.use(express.json());
app.use(cors());

const router = require('./routes/index');
router(app);

const port = process.env.PORT

app.listen(port, async () => {
    //console.log('Default language to ', setDefaultLanguage())
    await loadConfig()
   await setDefaultLanguage()
   await loadLanguage()
    console.log('started at ', port)
});


module.exports = app;


