const databaseConfig = require('./database.assist.utils')
const relationSync = async (database,model) => {
let relationsDatabase = await databaseConfig.openFile('config')
await Promise.all(relationsDatabase.map(async (config)=>{
    if(!config['relation']){
        return
    }
     await Promise.all(config['relation'].map(async (relation)=>{
        if(relation['table'] == database){
            console.log(`banco ${database} possui alguma relação com ${config.database}`)
           await databaseConfig.relationCreator(model,database,config.database,relation['key'])
        }
    })) 
}))
}
module.exports = {
    relationSync
}