const {saveFile,openFile} = require('../../api/utils/database.assist.utils')

const language = async (myArgs) =>{
    let databases = await openFile('config')
    let configIndex = databases.findIndex((v)=>v.config)
    if(configIndex == -1){
        databases.push({config:{language:myArgs[1]}})
    }
    databases.map((item)=>{
        if(item.config && item.config.language){
            item.config.language = myArgs[1]
        }
    })
    saveFile('config',databases)
}

module.exports = {
    language
}