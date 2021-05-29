const databaseConfig = require('../../utils/database.assist.utils')
const {openFile} = require('../../utils/database.utils')

function relationHandler(database) {

    return async (req, res, next) =>{

        let customDatabase = await databaseConfig.openCustomDatabase(database)
        if(customDatabase['relation']){
            console.log('tem relacao')
            await Promise.all(customDatabase['relation'].map(async (item)=>{
                if(req.body[item.key]){
                    let dataRelation = await openFile(item.table)
                    if(Array.isArray(req.body[item.key])){
                        req.body[item.key].map((key,index)=>{
                            let tryFind = dataRelation.findIndex((t)=>t.id == key)
                            if(tryFind == -1){
                                console.log('#####deleted',key)
                                req.body[item.key].splice(index)
                            }

                        })
                        if(req.body[item.key].length == 0){
                            delete req.body[item.key]
                        }
                    }else{
                        let tryFind = dataRelation.findIndex((t)=>t.id == req.body[item.key])
                        if(tryFind == -1){
                            delete req.body[item.key]
                            req.body = {...req.body}
                        }
                    }


                }
            }))
        }
        console.log('final',req.body)
        next()
    }
}

module.exports  = {
    relationHandler
}