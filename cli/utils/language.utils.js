const fs = require('fs');
const uuid = require('uuid').v4;
const path = require('path');
const root_dir = path.join(path.dirname(require.main.filename),'language')

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
        databases.push({config:{language:'en'}})
    }
    return 'en'
}
const getLanguage = async (database,id = null)=>{
    const databaseConfigUtils = require('../../api/utils/database.assist.utils')
    let configDatabase = await databaseConfigUtils.openFile('config')
    let languageSelected
    configDatabase.map((item)=>{
        if(item.config && item.config.language){
            languageSelected = item.config.language
        }
    })
   let language = await openFile(languageSelected)
  for(var item in language){
      console.log('item',item)
      if(id){
        let idRegex = new RegExp('%id',"g");
        language[item] = language[item].replace(idRegex,id)
      }
    let re = new RegExp('%database',"g");
    language[item] = language[item].replace(re,database)
  }
    console.log('language opened',languageSelected,language)
return language
}

module.exports = {
    openFile,
    saveFile,
    getLanguage,
    setDefaultLanguage

}
