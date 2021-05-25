const {tagsGenerator} = require('./tags.generator')
const {openFile,createModel,Insert,Update,Delete,updateOverwrite} = require('../utils/database.utils')
const tagEnabled =  Boolean(parseInt(process.env.TAGS))
const databaseConfig = require('../utils/database.assist.utils')

const isEnabled = () =>{
    return tagEnabled
}
const tagsUtil = (model) =>{
    if(!isEnabled()){
        return
    }
    const modelCopy = {...model}
    delete modelCopy['tags']
    const tags = model['tags']
    return {...modelCopy,...tags}
}
const tagsCreator = (model,tags) =>{
    if(!isEnabled()){
        return
    }
    return tagsGenerator(model,tags)
}
function isArray(obj){
    
    return Array.isArray(obj)
}

const tagsUpdate = async (arquivo,model) =>{
    if(!isEnabled()){
        return
    }
    const database = await openFile(arquivo)
    let tagsFinder = database.findIndex((item)=>item.id == model.id)
    if(database[tagsFinder]['tags']){
        model.tags.map((item)=>{
            if(!database[tagsFinder]['tags'].includes(item)){
                database[tagsFinder]['tags'].push(item)
            }
        })
    }
    return database[tagsFinder]['tags']
}
const tagsSync = async (origin,destin,key,id) =>{
    if(!isEnabled()){
        return
    }
    
    const databaseOrigin = await openFile(origin) //categoria
    const databaseDestin = await openFile(destin) //post
    let originConfig = await databaseConfig.openCustomDatabase(origin)
    let destinConfig = await databaseConfig.openCustomDatabase(destin)
    let originTag = originConfig['tag']
    let destinTag = destinConfig['tag']
    
    let allTags = []
    databaseDestin.map((destin)=>{
        let result = databaseOrigin.find((f)=>f.id == destin[key])
        if(!result){
            return
        }
       allTags.push(tagsGenerator(result,originTag))
    })
 
    //tagsGenerator( )
    
    //databaseDestin[index]['tags'] = [...originTags]
    // await updateOverwrite(destin,databaseDestin[index])
    
    
    
    // return databaseDestin
    //return destinTags.concat(originTags)
    //  return database[tagsFinder]['tags']
}



module.exports = {
    tagsUtil,
    
    tagsUpdate,
    tagsSync,
    tagsCreator
}