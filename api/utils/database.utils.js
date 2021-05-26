const fs = require('fs');
const uuid = require('uuid').v4;
const path = require('path');
const root_dir = path.join(path.dirname(require.main.filename),'api','database')

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
    let editTeste = copyJson.findIndex((item)=>item.id == model.id)
  //  delete model['id']
    json[editTeste] = {...model}
    await saveFile(arquivo,json)
}
const Insert = async (arquivo,model) =>{
    let json = await openFile(arquivo)
    json.push(model)
    await saveFile(arquivo,json)
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
        console.log('exception',exception)
        return false
    }
}

module.exports = {
    openFile,
    saveFile,
    Delete,
    Insert,
    updateOverwrite,
    Update,
    createModel
}
