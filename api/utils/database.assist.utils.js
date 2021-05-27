const fs = require('fs');
const uuid = require('uuid').v4;
const path = require('path');
const root_dir  = path.join(path.dirname(require.main.filename),'api','config')
const databaseHandler = require('./database.utils')
const tagUtils = require('./tags.utils')

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
const openCustomDatabase = async (database) =>{
    let filePath = path.join(root_dir,'config.json')
    if (fs.existsSync(filePath)) {
        
        const json =  fs.readFileSync(filePath);
        if(Object.keys(json).length == 0){
            console.log('não foi possivel abrir. Erro critico no banco',arquivo)
            await saveFile(arquivo,[])
        }
        
        let finder = JSON.parse(json).find((item)=>item.database === database)
        
        return finder
    }else{
        await saveFile(arquivo,[])
        const json =  fs.readFileSync(filePath);
        return JSON.parse(json)
    }
}
const createModel = (model) =>{
    return {id:uuid(),...model}
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
    const config = await openFile('config')
    const databaseConfig = config.find((dat)=>dat.database == database)
    const relationalConfig = config.find((dat)=>dat.database == relationDatabase)
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
            console.log('trying delete',body)
            console.log('##########id post afetado',id)
            
            await tagUtils.tagsSync(database,relationDatabase,key,id)
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
    relationCreator,
    Insert,
    updateOverwrite,
    openCustomDatabase,
    Update,
    createModel
}
