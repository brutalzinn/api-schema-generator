const databaseSave = require('./api/utils/database.utils')
const {verifyCommand} = require('./cli/commands')
const {saveFile,openFile} = require('./api/utils/database.assist.utils')
const config = (myArgs) =>{
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
    if(myArgs[2] == 'remove'){
      console.log('trying to remove..',myArgs[3])
      if(databases[finder]['config'] && databases[finder]['config'][myArgs[3]] && databases[finder]['config'][myArgs[3]].length == 0){
        delete databases[finder]['config'][myArgs[3]]
      }
      if(databases[finder]['config'] && Object.keys(databases[finder]['config']).length == 0){
        delete databases[finder]['config']
      }
      for(var item in databases[finder]['config']){
        if(item == myArgs[3]){
          if(myArgs[4] == undefined){
            console.log('deleting all key',myArgs[3])
            delete databases[finder]['config'][myArgs[3]]
          }else{
            databases[finder]['config'][myArgs[3]].map((item,index)=>{
              if(Object.keys(item)[0] == myArgs[4]){
                databases[finder]['config'][myArgs[3]].splice(index,1)
              }
            })
          }
          console.log('testess')
        }
      }
    }else{
      if(!myArgs[4]){
        console.log('none argument provided')
        return
      }
      if(!verifyCommand(myArgs)){
        console.log("invalid command")
        return
      }
      if(databases[finder]['config']){
        for(var item in databases[finder]['config']){
          console.log(myArgs[1],myArgs[2],myArgs[3],myArgs[4]) 
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
              console.log('atualizando')
              let index
              databases[finder]['config'][myArgs[2]].find(function(item, i){
                if(Object.keys(item) == myArgs[3]){
                  index = i;
                  return i;
                }
              })
              databases[finder]['config'][myArgs[2]][index] = {[myArgs[3]]:value}
              console.log(JSON.stringify( databases[finder]['config'][myArgs[2]][index]))
              alreadyRelation = false
            }
          })
        }
      }else{
        databases[finder]['config']= {[myArgs[2]]:[{[myArgs[3]]:value}]}        
      }
}
}


module.exports = {
    config
}