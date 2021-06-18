const fs = require('fs');
const path = require('path');
const databaseSave = require('./api/utils/database.utils')
const {verifyCommand,config,language,port} = require('./cli/commands')
const LangueUtils = require('./cli/utils/language.utils')
const {spawn} = require('child_process');
const {saveFile,openFile} = require('./api/utils//config.utils')

const root_dir  = path.join(path.dirname(require.main.filename),'api')
const myArgs = process.argv.slice(2);
const getLanguage = async (args) =>{
  await LangueUtils.loadLanguage()
  return LangueUtils.getLanguage(args)
}

const executor = async(myArgs) =>{
  let languageUtil = await getLanguage()
  let  commandUtils =  languageUtil['command']
  if(!commandUtils[myArgs[0]]){
    console.log('esse comando não existe')
    return
  }

  switch(myArgs[0]){
    case 'clear':
    const clearDatabase = async () =>{
      let databasePath = path.join(root_dir,'database',myArgs[1]+'.json')
      let languageLang = await getLanguage([myArgs[1]])
      if (fs.existsSync(databasePath)) {
        fs.unlinkSync(databasePath)
        console.log(languageLang['DATABASE_CLEAR'])
      }else{
        console.log('error:',languageLang['DATABASE_NOT_FOUND'])
      }
    }
    console.log('clear command')
    clearDatabase()
    break
    case 'drop':
    let dropDatabase = async (database) =>{
      let databasePath = path.join(root_dir,'database',database+'.json')
      let languageLang = await getLanguage([database])
      //remove database
      if (fs.existsSync(databasePath)) {
        fs.unlinkSync(path.join(root_dir,'database',database+'.json'))
      }else{
        console.log(languageLang['DATABASE_NOT_FOUND'])
        return
      }
      //remove config here
      let databases = await openFile('config')
      databases.map((data,index)=>{
        if(data.database == database){
          databases.splice(index,1)
          return
        }
      })
      await saveFile('config',databases)
      console.log(languageLang['DATABASE_DROP'])
    }
    dropDatabase(myArgs[1])

    break;
    case 'create':
    let createDatabase = async (database) =>{
      let languageLang = await getLanguage([database])
      let databases = await openFile('config')
      let databaseIndex = databases.findIndex((v)=>v.database == database)
      if(databaseIndex == -1){
        databases.push({database})
      }else{
        console.log(languageLang['DATABASE_EXIST'])
        return
      }
      await saveFile('config',databases)
      await databaseSave.openFile(database)
      console.log(languageLang['DATABASE_CREATE'])
      //  restartProcess()
    }
    createDatabase(myArgs[1])
    break
    case 'language':
    await language(myArgs)
    break
    case 'port':
    await port(myArgs)
    break
    case 'remove':
    let removeDatabaseOption = async (database) =>{
      let databases = await openFile('config')
      let languageLang = await getLanguage([myArgs[2]])
      if(!verifyCommand(myArgs)){
        console.log(languageLang['INVALID_COMMAND'])
        return
      }
      console.log(myArgs[1],myArgs[2])
      let finder = databases.findIndex((item)=>item.database === myArgs[1])
      for(var item in databases[finder]){
        if(item == myArgs[2]){
          delete databases[finder][item]
          //return
        }
      }

      await saveFile('config',databases)
      console.log(languageLang['KEY_CONFIG_REMOVE'])
    }
    removeDatabaseOption(myArgs[1])
    break;
    case 'tag':
    let createTag = async (database) =>{
      let databases = await openFile('config')
      let finder = databases.findIndex((item)=>item.database === database)
      let languageLang = await getLanguage([database])
      var myTags = []
      var alreadyTag = false
      let existedTags = []
      if(myArgs[2] != 'none'){
        if(myArgs[3] == 'true' || myArgs[3] == 'false'){
          var value = myArgs[3]
          switch(myArgs[3]){
            case 'true':
            value = true
            break
            case 'false':
            value = false
            break
          }
          if(!databases[finder]['config']){
            databases[finder]['config'] = {}
          }
          databases[finder]['config']['tag'] = [{[myArgs[2]]:value}]

        }
        if(!databases[finder]['config']){
          databases[finder]['config'] = {}
        }
        databases[finder]['config']['tag'] = [{[myArgs[2]]:true}]
      }
      if(!databases[finder]['config']){
        databases[finder]['config'] = {}
      }
      for(var i = 3;i < myArgs.length; i++){
        myTags.push(myArgs[i])
      }
      if(databases[finder]['tag']){
        existedTags = databases[finder]['tag']
      }else{
        existedTags = []
      }
      var allTags = existedTags.concat(myTags)
      let unique = [...new Set(allTags)];
      databases[finder] = {...databases[finder],tag:unique}
      if(myArgs[2] == 'none'){
        delete databases[finder]['config']['tag']
        if(Object.keys(databases[finder]['config']).length == 0){
          delete  databases[finder]['config']
        }
      }
      await saveFile('config',databases)
      console.log(languageLang['DATABASE_CREATE_TAG'])
    }
    createTag(myArgs[1])
    break;
    case 'config':
    await config(myArgs)
    break;
    case 'relation':
    let languageLang = await getLanguage([myArgs[1],myArgs[2],myArgs[3]])
    console.log(languageLang['DATABASE_CREATE_RELATION_ALERT'])
    let createRelation = async (child,father,key) =>{
      let databases = await openFile('config')
      var finder = databases.findIndex((item)=>item.database === child)
      var alreadyRelation = false
      if(databases[finder]['relation']){
        databases[finder]['relation'].map((item)=>{
          if(!item.table.includes(father)){
            databases[finder]['relation'].push({table:father,key})
            databases[finder] = {...databases[finder]}
            alreadyRelation =  false
          }else{
            alreadyRelation = true
          }
        })
      }else{
        databases[finder] = {...databases[finder],relation:[{table:father,key}]}
      }
      console.log(alreadyRelation)

      await saveFile('config',databases)
      if(alreadyRelation){
        console.log(languageLang['DATABASE_RELATION_ALREADY'])
      }else{
        console.log(languageLang['DATABASE_CREATE_RELATION'])
      }
    }
    createRelation(myArgs[1],myArgs[2],myArgs[3])
    break;


    case 'about':
    if(!myArgs[1]){

      for(var command in commandUtils){
        if(!commandUtils[command]['description'][command]){
          console.log('---------')
          console.log(command)
          console.log(commandUtils[command]['description'])
          console.log(commandUtils[command]['usage'])
          console.log('---------')
        }else{
          console.log('---------')
          console.log(command)

          for(var subDescription in commandUtils[command]['description']){
            console.log(commandUtils[command]['description'][subDescription])
            console.log(commandUtils[command]['usage'][subDescription])
          }
          console.log('---------')
        }

      }

    }
    if(myArgs.length > 3){
      console.log('no mode')
      return
    }
    const usage = () =>{
      if(commandUtils[myArgs[1]]){
        if(!myArgs[2]){
          if(commandUtils[myArgs[1]]['usage'][myArgs[1]]){
            return commandUtils[myArgs[1]]['usage'][myArgs[1]]
          }else{
            return commandUtils[myArgs[1]]['usage']
          }
        }else{
          if(commandUtils[myArgs[1]]['usage'][myArgs[2]]){
            return commandUtils[myArgs[1]]['usage'][myArgs[2]]
          }
        }
      }
    }
    const description = () =>{
      if(commandUtils[myArgs[1]]){
        if(!myArgs[2]){
          if(commandUtils[myArgs[1]]['description'][myArgs[1]]){
            return commandUtils[myArgs[1]]['description'][myArgs[1]]
          }else{
            return commandUtils[myArgs[1]]['description']
          }
        }else{
          if(commandUtils[myArgs[1]]['description'][myArgs[2]]){
            return commandUtils[myArgs[1]]['description'][myArgs[2]]
          }
        }
      }
    }
    if(!commandUtils[myArgs[1]]){
      console.log('Command not found')
      return
    }
    console.log(`${languageUtil['DATABASE_ABOUT_SHOW_INFO']}: ${myArgs[1]}`)
    console.log(`${languageUtil['DATABASE_ABOUT_SHOW_DESCRIPTION']}: ${description()}`)
    console.log(`${languageUtil['DATABASE_ABOUT_SHOW_SINTAX']}: ${usage()}`)
    break;

  }}

  executor(myArgs)
  //restartProcess()