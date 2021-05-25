const tagEnabled =  Boolean(parseInt(process.env.TAGS))
const {tagsGenerator} = require('../../utils/tags.generator')
const {openFile,createModel,Insert,Update,Delete,updateOverwrite} = require('../../utils/database.utils')
const databaseConfig = require('../../utils/database.assist.utils')
function tagsHandler(database) {
    
    return async (req, res, next) =>{
        let relationsDatabase = await databaseConfig.openFile('config')
        console.log('start')
        await Promise.all(relationsDatabase.map(async (config)=>{
            if(!config['relation']){
                return
            }
            
             await Promise.all(config['relation'].map(async (relation)=>{
                if(relation['table'] == database){
                    console.log(`banco ${database} possui alguma relação com ${config.database}`)
                   await databaseConfig.relationCreator(req.body,database,config.database,relation['key'])
                }
            })) 
            
            
        }))
        console.log('end')
        let customDatabase = await databaseConfig.openCustomDatabase(database)
        //console.log('custom db',customDatabase)
        let arrayRelationTag = []
        let toRemove = []
        const { body } = req;
        if(!tagEnabled){
            return next()
        }
        const relationCreator = async ()=>{
            if(Array.isArray(customDatabase['tag'])){
                if(!customDatabase['relation']){
                    return next()
                }
                return await Promise.all(customDatabase['relation'].map(async (relation)=>{
                    let myRelation = await openFile(relation.table)
                    if(Array.isArray(body[relation.key])){
                        await Promise.all(body[relation.key].map(async(keyArray)=>{
                            console.log('keyarray',keyArray)
                            let result = myRelation.find((f)=>f.id == keyArray)
                            if(!result){
                                toRemove.push(keyArray)
                                return
                                //return res.status(404).json({error:"cant find relation with " +relation.key })
                            }
                            if(body[relation.key]){
                                let customDatabaseRelation = await databaseConfig.openCustomDatabase(relation.table)
                                if(customDatabase['tag']){
                                    tagsGenerator(result,customDatabaseRelation['tag']).map((t)=>{
                                        arrayRelationTag.push(t)
                                    })
                                }
                            }
                            
                        }))
                    }else{
                        let result = myRelation.find((f)=>f.id == body[relation.key])
                        if(!result){
                            toRemove.push(keyArray)
                            return
                            
                            //   return res.json({error:"cant find relation with " +relation.key })
                        }
                        if(body[relation.key]){
                            let customDatabaseRelation = await databaseConfig.openCustomDatabase(relation.table)
                            
                            if(customDatabase['tag']){
                                tagsGenerator(result,customDatabaseRelation['tag']).map((t)=>{
                                    arrayRelationTag.push(t)
                                })
                            }
                        }
                    }
                }))
            }
            body[relation.key].map((tags,index)=>{
                if(toRemove.includes(tags)){
                    req.body[relation.key].splice(index,1)
                }
            })
            
        }
        
        await relationCreator()
        
        let customDatabaseRelation = await databaseConfig.openCustomDatabase(database)
        var tagsReceived = arrayRelationTag.concat(tagsGenerator(req.body,customDatabaseRelation['tag']))
        
        let tags = [...new Set(tagsReceived)];
        
        req.body = { ...req.body,tags}
        console.log('req.body',req.body)
        return next()
    }
    // if(!body['categoria']){
    //     req.body = { ...body,tags:[...tagsGenerator(body)] }
    
    //     return next()
    // }
    // let categoriaTag = []
    // let myCategory = await openFile('categoria')
    // console.log(myCategory)
    // if(isArray(body['categoria'])){
    //     body['categoria'].map((item)=>{
    //         let findedCategory  = myCategory.find((f)=>f.id == item)
    //         tagsGenerator(findedCategory).map((c)=>{
    //             categoriaTag.push(c)
    //         })
    //     })
    // }else{
    
    //     let findedCategory = myCategory.find((f)=>f.id == body['categoria'])
    //     tagsGenerator(findedCategory).map((c)=>{
    //         categoriaTag.push(c)
    //     })
    
    // }
    // req.body = { ...body,tags:[...tagsGenerator(body),...categoriaTag] }
    
    
    // next()
    
}
module.exports = {
    tagsHandler
}