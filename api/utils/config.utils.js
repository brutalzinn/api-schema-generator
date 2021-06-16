const fs = require('fs');
const uuid = require('uuid').v4;
const path = require('path');
const root_dir  = path.join(path.dirname(require.main.filename),'api','config')
const databaseHandler = require('./database.utils')
const tagUtils = require('./tags.utils')
var Config = {}

const openFile = async (arquivo) =>{
    let filePath = path.join(root_dir,arquivo+'.json')
    if (fs.existsSync(filePath)) {

        const json =  fs.readFileSync(filePath);
        if(Object.keys(json).length == 0){
            console.log('não foi possivel abrir. Erro critico no banco',arquivo)
            await saveFile(arquivo,[])
        }
        return JSON.parse(json)
    }else{
        await saveFile(arquivo,[])
        const json =  fs.readFileSync(filePath);
        return JSON.parse(json)
    }
}
const loadConfig = async () =>{
    console.log('loading config to..')
    var config =  await openFile('config')
    Config = config
}
const getConfig = async () =>{
    return  Config
}
const openCustomDatabase = async (database) =>{
    if(Object.keys(Config).length == 0){
        console.log('não foi possivel abrir. Erro critico no banco',arquivo)
        return false
    }
    let finder = Config.find((item)=>item.database === database)
    return finder
}
const createModel = (model) =>{
    return {id:uuid(),...model}
}
const setDefaultConfig = async () =>{
    const databaseConfigUtils = require('../../api/utils/config.utils')
    let configDatabase = await databaseConfigUtils.openFile('config')
    let configIndex = configDatabase.findIndex((v)=>v.config)
    if(configIndex == -1){
        configDatabase.push({config:{language:'en',port:'3000'}})
        await databaseConfigUtils.saveFile('config',configDatabase)

    }
    if(Object.keys(configDatabase).find(key => configDatabase[key] === 'port')){
        console.log('tem porta')
    }else{
        console.log('não tem porta')
    }
    console.log(Object.keys(configDatabase).find(key => configDatabase['port'] ))
    //
}
const Update = async (arquivo,model) =>{
    let json = await openFile(arquivo)
    let copyJson = [...json]
    var editTeste = copyJson.findIndex((item)=>item.id == model.id)
    delete model['id']
    json[editTeste] = {...json[editTeste],...model}
    await saveFile(arquivo,json)
}
const updateOverwrite = async (arquivo,model) =>{
    let json = await openFile(arquivo)
    let copyJson = [...json]
    var editTeste = copyJson.findIndex((item)=>item.id == model.id)
    // delete model['id']
    json[editTeste] = {...model}
    await saveFile(arquivo,json)
}
const Insert = async (arquivo,model) =>{
    let json = await openFile(arquivo)
    json.push(model)
    saveFile(arquivo,json)
}
const Delete = async (arquivo,id) =>{
    let json = await openFile(arquivo)
    let copyJson = [...json]
    var editTeste = copyJson.findIndex((item)=>item.id == id)
    json.splice(editTeste,1)
    await saveFile(arquivo,json)
}
const saveFile = async (arquivo,model) =>{
    try{
        fs.writeFileSync(path.join(root_dir,arquivo+'.json'),JSON.stringify(model),err => {
            if (err) throw err;
        });
        return true
    }catch(exception){
        return false
    }
}


const relationCreator = async (body,database,relationDatabase,key) =>{
    console.log('###########',body,database,relationDatabase,key)
    const relationDatabaseJson = await databaseHandler.openFile(relationDatabase)
    let toUpdate = []
    await Promise.all(relationDatabaseJson.map(async (data)=>{
        let id = data.id
        if(Array.isArray(data[key])){
            await Promise.all(data[key].map(async (f)=>{
                if(f == body.id){
                    let tags = await tagUtils.tagsSync(database,relationDatabase,key,id)
                    data['tags'] = tags
                    toUpdate.push(data)
                }
            }))
        }else{
            if(data[key] == body.id){
                let tags =  await tagUtils.tagsSync(database,relationDatabase,key,id)
                data['tags'] = tags
                toUpdate.push(data)
            }
        }
    }))

    await databaseHandler.updateOverwrite(relationDatabase,toUpdate)
}

const createDatabase = async () =>{


}
module.exports = {
    openFile,
    saveFile,
    Delete,
    setDefaultConfig,
    relationCreator,
    loadConfig,
    getConfig,
    Insert,
    updateOverwrite,
    openCustomDatabase,
    Update,
    createModel
}
