const express = require('express');
const cors = require('cors');
const {loadLanguage} = require('../cli/utils/language.utils')
const {loadConfig,setDefaultConfig,getPort} = require('./utils/config.utils')

const app = express();
app.use(express.json());
app.use(cors());

const router = require('./routes/index');
router(app);

// const port = process.env.PORT
// console.log('started at ',getPort())
getPort().then((port)=>{
app.listen(port, async () => {
    //console.log('Default language to ', setDefaultConfig())
    await loadConfig()
    await setDefaultConfig()
    await loadLanguage()
    console.log('Started at ', port)
});
})

module.exports = app;


