const {tagsGenerator} = require('./tags.generator')
const {openFile,createModel,Insert,Update,Delete,updateOverwrite} = require('../utils/database.utils')
const tagEnabled =  Boolean(parseInt(process.env.TAGS))

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

    console.log('######origin',origin,'destin',destin,'key',key,'id',id)
    let databaseConfig = require('../utils/database.assist.utils')
    
    console.log('#######tags sycn',isEnabled())
    const databaseOrigin = await openFile(origin) //categoria
    const databaseDestin = await openFile(destin) //post
    let originConfig = await databaseConfig.openCustomDatabase(origin)
    let destinConfig = await databaseConfig.openCustomDatabase(destin)
    let originTag = originConfig['tag']
    let destinTag = destinConfig['tag']
    
    let existedTags = []
    let father = databaseDestin.find((d)=> d.id == id)
    if(!father){
        return
    }
    const regenerate = async () =>{
        tagsGenerator(father,destinTag).map((t)=>{
            existedTags.push(t)
        })
        let unique = [...new Set(existedTags)];
        father['tags'] = [...unique]
        await updateOverwrite(destin,father)
    }
    if(Array.isArray(father[key])){
        await Promise.all(father[key].map( async (c)=>{
            let result = databaseOrigin.find((f)=>f.id == c)
            if(!result){
                let indexCategory = father[key].findIndex((i)=>i == c)
               father[key].splice(indexCategory,1)
            }else{
                tagsGenerator(result,originTag).map((t)=>{
                    existedTags.push(t)
                })
            }

        }))
    }else{
        let result = databaseOrigin.find((f)=>f.id == father[key])
        if(!result){
            delete father[key]
            console.log('tentando deletar esse cara aqui',father[key])
        }else{
            tagsGenerator(result,originTag).map((t)=>{
                existedTags.push(t)
            })
        }
    }
await regenerate()
    //  return unique
    //return destinTags.concat(originTags)
    //  return database[tagsFinder]['tags']
}



module.exports = {
    tagsUtil,
    
    tagsUpdate,
    tagsSync,
    tagsCreator
}