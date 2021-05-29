const {saveFile,openFile} = require('../../api/utils/database.assist.utils')
const LangueUtils = require('../utils/language.utils')

const getLanguage = async (args) =>{
    await LangueUtils.loadLanguage()
    return LangueUtils.getLanguage(args)
}
const language = async (myArgs) =>{
    let databases = await openFile('config')
    let configIndex = databases.findIndex((v)=>v.config)
    let langResponse = await getLanguage([myArgs[1]])
    if(configIndex == -1){
        databases.push({config:{language:myArgs[1]}})
    }
    databases.map((item)=>{
        if(item.config && item.config.language){
            item.config.language = myArgs[1]
        }
    })
    saveFile('config',databases)
    console.log(langResponse['LANGUAGE_CHANGED'])
}

module.exports = {
    language
}