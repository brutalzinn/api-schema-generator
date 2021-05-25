const fs = require('fs');
const path = require('path');
const {saveFile,openFile} = require('./api/utils/database.assist.utils')
const root_dir  = path.join(path.dirname(require.main.filename),'api')
var myArgs = process.argv.slice(2);


switch(myArgs[0]){
  
  case 'drop':
  fs.unlinkSync(path.join(root_dir,'database',myArgs[1]+'.json'))
  console.log(`database ${myArgs[1]} are sucefull dropped`)
  break;
  case 'create':
  let createDatabase = async (database) =>{
    let databases = await openFile('config')
    databases.push({database})
    await saveFile('config',databases)
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
    for(var i = 2;i < myArgs.length; i++){
      myTags.push(myArgs[i])
    }
    
    console.log('tags',myTags)
    var allTags = databases[finder]['tag'].concat(myTags)

    let unique = [...new Set(allTags)];

      
    // }else{
     databases[finder] = {...databases[finder],tag:unique}
    // }
    await saveFile('config',databases)
    console.log(`database ${database} are sucefull created`)
  }
  createTag(myArgs[1])
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
  case 'create':
  
  break;
  
}