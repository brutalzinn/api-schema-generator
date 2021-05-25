const tagEnabled =  Boolean(parseInt(process.env.TAGS))
const {tagsGenerator} = require('../../utils/tags.generator')
const {openFile,createModel,Insert,Update,Delete,updateOverwrite} = require('../../utils/database.utils')
const databaseConfig = require('../../utils/database.assist.utils')
function tagsHandler(database) {
    
    return async (req, res, next) =>{
        let customDatabase = await databaseConfig.openCustomDatabase(database)
        
        const { body } = req;
        if(!tagEnabled){
            return next()
        }
        var teste
        const relationCreator = async ()=>{
        if(customDatabase['tag']){
            return await Promise.all(customDatabase['relation'].map(async (relation)=>{
                    let myRelation = await openFile(relation.table)
                    let result = myRelation.find((f)=>f.id == body[relation.key])
                    if(!result){
                        return res.json({error:"cant find relation with " +relation.key })
                    }
                    if(body[relation.key]){
                        let customDatabaseRelation = await databaseConfig.openCustomDatabase(relation.table)
                        if(customDatabase['tag']){
                            req.body = { ...req.body,tags:[...tagsGenerator(result,customDatabaseRelation['tag'])] }
                        }
                    }
            }))
        }
    }
    await relationCreator()
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