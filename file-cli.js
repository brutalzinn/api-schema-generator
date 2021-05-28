const fs = require('fs');
const path = require('path');
const databaseSave = require('./api/utils/database.utils')
const {verifyCommand} = require('./cli/commands')
const {saveFile,openFile} = require('./api/utils/database.assist.utils')
const root_dir  = path.join(path.dirname(require.main.filename),'api')
var myArgs = process.argv.slice(2);

const executor = async(myArgs) =>{
  switch(myArgs[0]){
    
    case 'clear':
    fs.unlinkSync(path.join(root_dir,'database',myArgs[1]+'.json'))
    break
    case 'drop':
    let dropDatabase = async (database) =>{
      fs.unlinkSync(path.join(root_dir,'database',database+'.json'))
      let databases = await openFile('config')
      databases.map((data,index)=>{
        if(data.database == database){
          databases.splice(index,1)
          return
        }
      })
      await saveFile('config',databases)
    }
    dropDatabase(myArgs[1])
    console.log(`database ${myArgs[1]} are sucefull dropped`)
    break;
    case 'create':
    let createDatabase = async (database) =>{
      let databases = await openFile('config')
      databases.push({database})
      await saveFile('config',databases)
      await databaseSave.openFile(database)
      console.log(`database ${database} are sucefull created`)
    }
    createDatabase(myArgs[1])
    break;
    case 'tag':
    console.log('creating tag to database',myArgs[1])
    
    let createTag = async (database) =>{
      let databases = await openFile('config')
      let finder = databases.findIndex((item)=>item.database === myArgs[1])
      var myTags = []
      var alreadyTag = false
      let existedTags = []
      for(var i = 2;i < myArgs.length; i++){
        myTags.push(myArgs[i])
      }
      if(databases[finder]['tag']){
        existedTags = databases[finder]['tag']
      }else{
        existedTags = []
      }
      console.log('tags',myTags)
      var allTags = existedTags.concat(myTags)
      
      let unique = [...new Set(allTags)];
      
      
      // }else{
      databases[finder] = {...databases[finder],tag:unique}
      // }
      await saveFile('config',databases)
      console.log(`database ${database} are sucefull created`)
    }
    createTag(myArgs[1])
    break;
    case 'config':
    if(!myArgs[4]){
      console.log('none argument provided')
      return
    }
    console.log(`Setting config ${myArgs[1]} for ${myArgs[2]}=${myArgs[3]}`)
    let databases = await openFile('config')
    let finder = databases.findIndex((item)=>item.database === myArgs[1])
    
    if(finder === -1){
      console.log('cant find the table:',myArgs[1])
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
    if(!verifyCommand(myArgs)){
      console.log("invalid command")
      return
    }
    
    
    
    
    
    if(myArgs[3] == 'remove'){
      for(var item in databases[finder]['config']){
        
        
      }
      return
    }
    if(databases[finder]['config']){
      for(var item in databases[finder]['config']){
        //console.log('item',databases[finder]['config'][item])
        console.log(myArgs[1],myArgs[2],myArgs[3],myArgs[4]) 
        databases[finder]['config'][item].map((m,index)=>{
          let alreadyExistKey = false
          
          console.log('item',m)
          
          let key = Object.keys(m)[0]
        
      
        
         if(!databases[finder]['config'][myArgs[2]]){
           console.log('true',myArgs[2])
          databases[finder]['config'][myArgs[2]] = [{[myArgs[3]]:value}]
          console.log(  databases[finder]['config'][myArgs[2]])
         }
          // databases[finder]['config'][myArgs[2]].push({...databases[finder]['config'][myArgs[2]],[myArgs[2]]:[{[myArgs[3]]:value}]})
          // console.log( databases[finder]['config'])
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
            console.log('atualizando')
            let index
            databases[finder]['config'][myArgs[2]].find(function(item, i){
              if(Object.keys(item) == myArgs[3]){
                index = i;
                return i;
              }
            })
            // console.log('teste item',teste)
            //console.log({index,[myArgs[3]]:value})
            databases[finder]['config'][myArgs[2]][index] = {[myArgs[3]]:value}
            console.log(JSON.stringify( databases[finder]['config'][myArgs[2]][index]))
            alreadyRelation = false
          }
        })
      }
      
      console.log(alreadyRelation)
    }else{
      console.log('executando isso')
      databases[finder]['config']= {[myArgs[2]]:[{[myArgs[3]]:value}]}
      
    }
    await saveFile('config',databases)
    
    break;
    case 'relation':
    console.log(`Creating relation in ${myArgs[1]} with ${myArgs[2]} using key ${myArgs[3]}`)
    let createRelation = async (child,father,key) =>{
      let databases = await openFile('config')
      var finder = databases.findIndex((item)=>item.database === child)
      var alreadyRelation = false
      if(databases[finder]['relation']){
        databases[finder]['relation'].map((item)=>{
          if(!item.table.includes(father)){
            databases[finder]['relation'].push({table:father,key})
            databases[finder] = {...databases[finder]}
            alreadyRelation =  true
          }else{
            alreadyRelation = false
          }
        })
      }else{
        databases[finder] = {...databases[finder],relation:[{table:father,key}]}
      }
      await saveFile('config',databases)
      if(!alreadyRelation){
        console.log('Error: Relation already exists')
      }else{
        console.log(`Created relation in ${myArgs[1]} with ${myArgs[2]} using key ${myArgs[3]}`)
        
      }
    }
    createRelation(myArgs[1],myArgs[2],myArgs[3])
    //createDatabase(myArgs[1])
    break;
    
    
    case 'about':
    var messagem = 'Olá!!! bem-vindo à selva, bootcampers da noite. \n Essa é uma pequena api que armazena dados em um documento json. \n Parecido com o MongoDB!'+
    '\n Sinta-se livre para alterar, fazer pedidos de merge e construir seu projeto super maneiro com essa api'+
    '\n Github: @brutalzinn Gitlab: @roberto.paes Linkedin: roberto-paes'
    console.log('\x1b[36m%s\x1b[0m',messagem)
    break;
    case 'health':
    console.log(`checking health of ${myArgs[1]}`)
    let filePath = path.join(root_dir,myArgs[1]+'.json')
    if (fs.existsSync(filePath)) {
      console.log(`The health of ${myArgs[1]} has 100% OK`)
    }
    break;
    
  }}
  
  executor(myArgs)