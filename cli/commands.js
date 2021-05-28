
const config = require('./handler')

const checkCommand = (command,args) =>{
    console.log('teste',command)

    command = command.toLocaleLowerCase()
    args = args.toLocaleLowerCase()
    if(Array.isArray(config.configHandler[command])){
        console.log('config',config.configHandler[command].includes(args))

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
        case 'remove':
        console.log('delete',command[1],command[2])
        return checkCommand(command[0],command[2])
        
    }
    
}

module.exports = {
    verifyCommand
}