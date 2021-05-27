const {openFile,createModel,Insert,Update,Delete} = require('../utils/database.utils')
const databaseUtil = require('../utils/database.assist.utils')

const getDatabaseInfo = async (database,params) => {
    
    var searchParams = params.query.query.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase().split(' ');
let databaseConfig = await databaseUtil.openCustomDatabase(database)
let relations = databaseConfig['relation']
//console.log('config',databaseConfig,relationalData)
    console.log('params ', searchParams,relations)
    searchParams.map((item)=>{
        console.log(item)
    })
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