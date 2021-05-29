
const handler = require('./handler')

const {config} = require('./commands/config')
const {language} = require('./commands/language')

const checkCommand = (command,args) =>{
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
            if(!command[4] || !command[3]){
                return false
            }
            return checkCommand(command[2],command[3])
        }
        break
        case 'remove':
        if(!command[2] || !command[1]){
            return false
        }
        return checkCommand(command[0],command[2])
        case 'tag':
        return checkCommand(command[0],command[2])

    }

}

module.exports = {
    verifyCommand,
    config,
    language
}