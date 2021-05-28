
const handler = require('./handler')
const {config} = require('./commands/config')

const checkCommand = (command,args) =>{
    console.log('teste',command)
    
    command = command.toLocaleLowerCase()
    args = args.toLocaleLowerCase()
    if(Array.isArray(handler.configHandler[command])){
        return handler.configHandler[command].includes(args)
    }
    
}
const verifyCommand = (command) => {
    switch(command[0]){
        case 'config':
        switch(command[2]){
            case 'search':
            return checkCommand(command[2],command[3])
        }
        break
        case 'remove':
        console.log('delete',command[1],command[2])
        return checkCommand(command[0],command[2])
        case 'tag':
        console.log('validation of tag',command[1],command[2])
        return checkCommand(command[0],command[2])
        
    }
    
}

module.exports = {
    verifyCommand,
    config
}