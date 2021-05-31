const tagEnabled =  Boolean(parseInt(process.env.TAGS))
const {tagsGenerator} = require('../../utils/tags.generator')
const {openFile,createModel,Insert,Update,Delete,updateOverwrite} = require('../../utils/database.utils')
const databaseConfig = require('../config.utils')
function tagsHandler(database) {

    return async (req, res, next) =>{

        console.log('end')
        let customDatabase = await databaseConfig.openCustomDatabase(database)
        //console.log('custom db',customDatabase)
        let arrayRelationTag = []
        let toRemove = []
        const { body } = req;
        let generateAll = false


        if(customDatabase['config'] &&  customDatabase['config']['tag']){
            customDatabase['config']['tag'].map((item,index)=>{
                if(customDatabase['config']['tag'][index]['generateall'] != undefined){
                    generateAll = (customDatabase['config']['tag'][index]['generateall'] === true)
                }
            })
        }
        const relationAsync = async (body,table,key) =>{

            let myRelation = await openFile(table)

            if(Array.isArray(body[key])){
                await Promise.all(body[key].map(async(keyArray)=>{
                    let result = myRelation.find((f)=>f.id == keyArray)
                    if(!result){
                        toRemove.push(keyArray)
                        return
                    }
                    if(body[key]){
                        let customDatabaseRelation = await databaseConfig.openCustomDatabase(table)
                        if(customDatabaseRelation['tag']){
                            tagsGenerator(result,customDatabaseRelation['tag']).map((t)=>{
                                arrayRelationTag.push(t)
                            })
                        }
                    }
                }))
                body[key].map((tags,index)=>{
                    if(toRemove.includes(tags)){
                        req.body[key].splice(index,1)
                    }
                })
            }else{
                var result = myRelation.find((f)=>f.id == body[key])
                if(!result){
                    delete req.body[key]
                    return
                }
                if(req.body[key]){
                    let customDatabaseRelationSingle = await databaseConfig.openCustomDatabase(table)
                    if(customDatabaseRelationSingle['tag']){
                        tagsGenerator(result,customDatabaseRelationSingle['tag']).map((t)=>{
                            arrayRelationTag.push(t)
                        })
                    }
                }
            }


        }

        const relationCreator = async ()=>{


            if(Array.isArray(customDatabase['tag'])){


                if(!customDatabase['relation']){
                    return
                }
                await Promise.all(customDatabase['relation'].map(async (relation)=>{
                    if(!body[relation.key]){
                        var databaseChecker = await openFile(database)
                        if(body['id']){
                            let finder = databaseChecker.find((data)=>data.id == body['id'])
                            if(!finder){
                                return
                            }else{
                                console.log('vindo finder',finder)

                                await relationAsync(finder,relation.table,relation.key)
                            }
                        }

                        //return next()
                    }
                    if(body[relation.key]){
                        await relationAsync(body,relation.table,relation.key)
                    }


                }))
            }


        }
        if(generateAll){
            await relationCreator()
        }
        let customDatabaseRelation = await databaseConfig.openCustomDatabase(database)
        if(!customDatabaseRelation['tag']){
        return next()
        }
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