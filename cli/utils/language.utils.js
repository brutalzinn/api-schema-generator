const fs = require('fs');
const uuid = require('uuid').v4;
const path = require('path');
const root_dir = path.join(path.dirname(require.main.filename),'language')
var Language = {}
const openFile = async (arquivo) =>{
    let filePath = path.join(root_dir,arquivo+'.json')
    if (fs.existsSync(filePath)) {
        const json =  fs.readFileSync(filePath);
        return JSON.parse(json)
    }else{
        console.log('language doesnt exist')
    }
}
const saveFile = async (arquivo,model) =>{
    try{
        await fs.writeFileSync(path.join(root_dir,arquivo+'.json'),JSON.stringify(model),err => {
            if (err) throw err;
        });
        return true
    }catch(exception){
        console.log('exception',exception)
        return false
    }
}
const setDefaultLanguage = async () =>{
    const databaseConfigUtils = require('../../api/utils/database.assist.utils')
    let configDatabase = await databaseConfigUtils.openFile('config')
    let configIndex = configDatabase.findIndex((v)=>v.config)
    if(configIndex == -1){
        configDatabase.push({config:{language:'en'}})
        await databaseConfigUtils.saveFile('config',configDatabase)
    }
    //
}
const loadLanguage = async () =>{
    const databaseConfigUtils = require('../../api/utils/database.assist.utils')
    let configDatabase = await databaseConfigUtils.openFile('config')
    let languageSelected
    configDatabase.map((item)=>{
        if(item.config && item.config.language){
            languageSelected = item.config.language
        }
    })
    Language = await openFile(languageSelected)
}
const getLanguage = async (args)=>{
    const databaseConfigUtils = require('../../api/utils/database.assist.utils')
    let configDatabase = await databaseConfigUtils.openFile('config')
    let languageSelected
    configDatabase.map((item)=>{
        if(item.config && item.config.language){
            languageSelected = item.config.language
        }
    })
    for(var item in Language){
        args.map((arg,index)=>{
            let idRegex = new RegExp(`%${index}`,"g");
            Language[item] = Language[item].replace(idRegex,arg)
        })
    }
    return Language
}

module.exports = {
    openFile,
    saveFile,
    loadLanguage,
    getLanguage,
    setDefaultLanguage

}
