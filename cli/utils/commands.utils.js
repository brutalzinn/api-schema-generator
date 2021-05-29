module.exports ={

    clear:{
        name:"clear",
        description:"Clear a collection",
        usage:"clear <collection>"
    },
    drop:{
        name:"drop",
        description:"drop a collection",
        usage:"drop <collection>"
    },
    create:{
        name:"create",
        description:"create a collection",
        usage:"create <collection>"
    },
    language:{
        name:"language",
        description:"Sets the language",
        usage:"language <filename>"
    },
    remove:{
        name:"remove",
        description:"Remove a relation or a tag of a especify collection.",
        usage:"remove <collection> <tag or relation>"
    },
    tag:{
        name:"tag",
        description:"Create a tag to a collection with especify type of tag generation. This will be used for advanced search route.",
        usage:"tag <database> <generateall or none> <tags separed by comma>"
    },
    relation:{
        name:"relation",
        description:"Create a relation between father and child collections.",
        usage:"relation <father> <child> <key>"
    },
    config:{
        name:"config",
        description:{config:"Create a config to a collection with especify key.",remove:"Remove a config of a collection with especify key."},
        usage:{config:"config <database> <option> <key> <value>",remove:"config <database> remove <key>"}
    },
    about:{
        name:"about",
        description:"Show info about a command.",
        usage:"about <command>"
    },

}