const databaseSave = require('../../api/utils/database.utils')
const {saveFile,openFile} = require('../../api/utils/database.assist.utils')

const LangueUtils = require('../utils/language.utils')

const getLanguage = async (args) =>{
    await LangueUtils.loadLanguage()
    return LangueUtils.getLanguage(args)
}
const config = async (myArgs) =>{
    const {verifyCommand} = require('../commands')

    let databases = await openFile('config')
    let finder = databases.findIndex((item)=>item.database === myArgs[1])
    let languageLang = await getLanguage([myArgs[1]])
    let langueFinish = await getLanguage([myArgs[3],myArgs[1]])
    if(finder === -1){
        console.log(languageLang['DATABASE_NOT_FOUND'])
        return
    }

    var alreadyRelation = false
    var value = myArgs[4]
    switch(myArgs[4]){
        case 'true':
        value = true
        break
        case 'false':
        value = false
        break
    }
    let deleteKey = await getLanguage([myArgs[3]])

    if(myArgs[2] == 'remove'){

        for(var item in databases[finder]['config']){
            if(item == myArgs[3]){
                if(myArgs[4] == undefined){
                    console.log(deleteKey['DATABASE_CONFIG_DELETE_ALL'])
                    delete databases[finder]['config'][myArgs[3]]
                }else{
                    databases[finder]['config'][myArgs[3]].map((item,index)=>{
                        if(Object.keys(item)[0] == myArgs[4]){
                            databases[finder]['config'][myArgs[3]].splice(index,1)
                        }
                    })
                }
            }
        }
        console.log(langueFinish['DATABASE_DELETE_CONFIG'])

        if(databases[finder]['config'] && databases[finder]['config'][myArgs[3]] && databases[finder]['config'][myArgs[3]].length == 0){
            delete databases[finder]['config'][myArgs[3]]
        }
        if(databases[finder]['config'] && Object.keys(databases[finder]['config']).length == 0){
            delete databases[finder]['config']
        }
    }else{
        if(!myArgs[4]){
            console.log(languageLang['DATABASE_NOT_FOUND_KEY'])
            return
        }
        if(!verifyCommand(myArgs)){
            console.log(languageLang['INVALID_COMMAND'])
            return
        }
        if(databases[finder]['config']){
            for(var item in databases[finder]['config']){
                databases[finder]['config'][item].map((m,index)=>{
                    let key = Object.keys(m)[0]
                    if(!databases[finder]['config'][myArgs[2]]){
                        databases[finder]['config'][myArgs[2]] = [{[myArgs[3]]:value}]
                    }
                    if(key != myArgs[3] && m[myArgs[3]] != value){
                        let canProcess =  databases[finder]['config'][myArgs[2]].map((t,index)=>{
                            if(Object.keys(t)[0] == myArgs[3]){
                                return false
                            }else{
                                return true
                            }
                        })
                        if(canProcess.includes(false)){
                            return
                        }
                        databases[finder]['config'][myArgs[2]].push({[myArgs[3]]:value})
                        alreadyRelation =  true
                    }else if(key == myArgs[3] && m[myArgs[3]] != value){
                        let index
                        databases[finder]['config'][myArgs[2]].find(function(item, i){
                            if(Object.keys(item) == myArgs[3]){
                                index = i;
                                return i;
                            }
                        })
                        databases[finder]['config'][myArgs[2]][index] = {[myArgs[3]]:value}
                        alreadyRelation = false
                    }
                })
            }
        }else{
            databases[finder]['config']= {[myArgs[2]]:[{[myArgs[3]]:value}]}
        }
        console.log(langueFinish['DATABASE_CREATE_CONFIG'])

    }

    await saveFile('config',databases)




}


module.exports = {
    config
}