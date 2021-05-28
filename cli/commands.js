
const config = require('./config')

const checkCommand = (command,args) =>{
    command = command.toLocaleLowerCase()
    args = args.toLocaleLowerCase()
    if(Array.isArray(config.configHandler[command])){
        return config.configHandler[command].includes(args)
    
    }
    
}
const verifyCommand = (command) => {
    switch(command[0]){
        case 'config':
        switch(command[2]){
            case 'tag':
            return checkCommand(command[2],command[3])
            case 'search':
            return checkCommand(command[2],command[3])
        }
        
        break
    }
    
}

module.exports = {
    verifyCommand
}