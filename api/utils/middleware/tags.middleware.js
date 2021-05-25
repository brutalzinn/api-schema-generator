const tagEnabled =  Boolean(parseInt(process.env.TAGS))
const {tagsGenerator} = require('../../utils/tags.generator')
const {openFile,createModel,Insert,Update,Delete,updateOverwrite} = require('../../utils/database.utils')
const databaseConfig = require('../../utils/database.assist.utils')

function isArray(obj){
    return !!obj && obj.constructor === Array;
}


function tagsHandler(database) {
    
    return async (req, res, next) =>{
        console.log(tagEnabled)
        let customDatabase = await databaseConfig.openCustomDatabase(database)
        
        const { body } = req;
        if(!tagEnabled){
            console.log('#########tag disabled')
            return next()
        }
        if(customDatabase['tag']){
            
            
            customDatabase['relation'].map((relation)=>{
                const relationCreator = async ()=>{
                    console.log('relation with',relation.table)
                    let myRelation = await openFile(relation.table)
                    
                    let result = myRelation.find((f)=>f.id == body[relation.key])
                    if(!result){
                        return res.json({error:"cant find relation with " +relation.key })
                    }
                    console.log(result)
                    if(body[relation.key]){
                        console.log('we have a key and will do the relation here.')
                        let customDatabase = await databaseConfig.openCustomDatabase(relation.table)

                        if(customDatabase['tag']){
                            console.log ('tags',tagsGenerator(result,customDatabase['tag']))
                        }else{
                            console.log('this database doesnt have tag enabled.')
                        }
                        
                    }
                    console.log('result',result)
                }
                relationCreator()
                
            })
            
            
            
        }
        return next()
        if(!body['categoria']){
            req.body = { ...body,tags:[...tagsGenerator(body)] }
            
            return next()
        }
        let categoriaTag = []
        let myCategory = await openFile('categoria')
        console.log(myCategory)
        if(isArray(body['categoria'])){
            body['categoria'].map((item)=>{
                let findedCategory  = myCategory.find((f)=>f.id == item)
                tagsGenerator(findedCategory).map((c)=>{
                    categoriaTag.push(c)
                })
            })
        }else{
            
            let findedCategory = myCategory.find((f)=>f.id == body['categoria'])
            tagsGenerator(findedCategory).map((c)=>{
                categoriaTag.push(c)
            })
            
        }
        req.body = { ...body,tags:[...tagsGenerator(body),...categoriaTag] }
        
        
        next()
    }
}
module.exports = {
    tagsHandler
}