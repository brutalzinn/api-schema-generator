const {saveFile,openFile} = require('../../api/utils/config.utils')
const LangueUtils = require('../utils/language.utils')

const getLanguage = async (args) =>{
    await LangueUtils.loadLanguage()
    return LangueUtils.getLanguage(args)
}
const port = async (myArgs) =>{
    let databases = await openFile('config')
    let configIndex = databases.findIndex((v)=>v.config)
    let langResponse = await getLanguage([myArgs[1]])
    if(configIndex == -1){
        databases.push({config:{port:myArgs[1]}})
    }
    databases.map((item)=>{
        if(item.config){
            item.config.port = myArgs[1]
        }
    })
    saveFile('config',databases)
    console.log(langResponse['PORT_CHANGED'])
}

module.exports = {
    port
}