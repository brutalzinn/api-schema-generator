const {openFile,createModel,Insert,Update,Delete} = require('../utils/database.utils')
const databaseUtil = require('../utils/database.assist.utils')

const getDatabaseInfo = async (database,params) => {
    var searchParams = params.query.query.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().split(' ');
    console.log(searchParams)
    let id = params.query.id
    let databaseConfig = await databaseUtil.openCustomDatabase(database)
    let relations = databaseConfig['relation']
    var response = []
    if(!relations)
    {
        return
    }
    let json = await openFile(database)
    
    if(id){
        json = json.find((g)=>g.id === id)
    }
    
    
    
    await Promise.all(relations.map(async (relat)=>{
        if(searchParams.includes(relat.table)){
            if(json[relat.key]){
                if(Array.isArray(json[relat.key])){
                    let relationTable = await openFile(relat.table)
                    if(!relationTable){
                        return
                    }
                    let tmpRelationArray = []
                    json[relat.key].map((v)=>{
                        let relationFinded = relationTable.find((f)=>f.id === v)
                        tmpRelationArray.push(relationFinded)
                    })
                    json = {...json,[relat.key]:tmpRelationArray}
                    
                }else{  
                    let relationTable = await openFile(relat.table)
                    
                    if(!relationTable){
                        return
                    }
                    let relationFinded = relationTable.find((f)=>f.id === json[relat.key])
                    json = {...json,[relat.key]:relationFinded}
                    
                }
                
            }
        }
    }))
    
    
    if(!Array.isArray(json)){
        return await json
    }
    await Promise.all(json.map(async (item,index)=>{
        await Promise.all(relations.map(async (relat)=>{
            if(searchParams.includes(relat.table)){
                if(item[relat.key]){
                    if(Array.isArray(item[relat.key])){
                        let relationTable = await openFile(relat.table)
                        if(!relationTable){
                            return
                        }
                        let tmpRelationArray = []
                        item[relat.key].map((v)=>{
                            let relationFinded = relationTable.find((f)=>f.id === v)
                            tmpRelationArray.push(relationFinded)
                        })
                        json[index] = {...json[index],[relat.key]:tmpRelationArray}
                        
                    }else{  
                        let relationTable = await openFile(relat.table)
                        
                        if(!relationTable){
                            return
                        }
                        let relationFinded = relationTable.find((f)=>f.id === item[relat.key])
                        json[index] = {...json[index],[relat.key]:relationFinded}
                        
                    }
                    
                }
            }
        }))
    }))
    
    
    
    return await json
    // console.log('params ', searchParams,relations)
    //     searchParams.map((item)=>{
    //         console.log(item)
    //     })
    // const json = await openFile(database)
    //  return json.find((item)=>item[column] == value)
}
function isArray(obj){
    return !!obj && obj.constructor === Array;
}

const searchFinder = async(database,req) => {
    
    var searchParams = req.query.query.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase().split(' ');
    //let teste = []
    
    var regex = searchParams.map((item)=>{
        //teste.push({$regex:`^${item}`, $options : 'i'})
        return new RegExp( '^'+ item,'i' ); 
    })
    console.log('####',searchParams)
    //return estabelecimento.find({ tags: { $all: searchParams } }, function (e, docs) {
    let response = []
    const json = await openFile(database)
    json.map((item,index)=>{
        regex.map((reg)=>{
            if(isArray(item['tags'])){
                item['tags'].map((tag)=>{
                    if(reg.test(tag)){
                        response.push(json[index])
                    }
                })
            }else{
                if(reg.test(item['tags'])){
                    response.push(json[index])
                }
            }
            
        })
    })
    return response
    //return json.find((item)=>item.tags == regex)
}
module.exports = {
    getDatabaseInfo,
    searchFinder
}