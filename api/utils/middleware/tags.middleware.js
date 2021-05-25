const tagEnabled =  Boolean(parseInt(process.env.TAGS))
const {tagsGenerator} = require('../../utils/tags.generator')
const {openFile,createModel,Insert,Update,Delete,updateOverwrite} = require('../../utils/database.utils')
const databaseConfig = require('../../utils/database.assist.utils')
function tagsHandler(database) {
    
    return async (req, res, next) =>{
        let customDatabase = await databaseConfig.openCustomDatabase(database)
        let arrayRelationTag = []

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
                            let result = myRelation.find((f)=>f.id == keyArray)
                            if(!result){
                                return res.json({error:"cant find relation with " +relation.key })
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
                            return res.json({error:"cant find relation with " +relation.key })
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
        }
        await relationCreator()
        let customDatabaseRelation = await databaseConfig.openCustomDatabase(database)
       var tags = arrayRelationTag.concat(tagsGenerator(req.body,customDatabaseRelation['tag']))
          req.body = { ...body,tags}
        console.log('ttttt',req.body)
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