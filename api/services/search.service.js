const {openFile,createModel,Insert,Update,Delete} = require('../utils/database.utils')
const databaseUtil = require('../utils/config.utils')

const getDatabaseInfo = async (database,params) => {
    var searchParams = params.query.query.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().split(' ');
    let id = params.query.id
    let databaseConfig = await databaseUtil.openCustomDatabase(database)
    let relations = databaseConfig['relation']
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
    var global = []

    const recursiveRelation = async (findedOriginal,relationsTable) =>{
        //console.log('received',findedOriginal,relationsTable)


        if(!relationsTable['relation']){
            return
        }
        await  Promise.all(relationsTable['relation'].map(async(item,index)=>{

            // let subTable = await openFile(item.table)
            // let subFinder = subTable.find((f)=>f.id === findedOriginal[item.key])
            // global = {...findedOriginal,[item.key]:[subFinder]}
            // console.log('globo',item,index)
//            console.log(item)
            let subRelations = await databaseUtil.openCustomDatabase(item.table)
            //    console.log(item.key)

console.log(item.table,subRelations)

        }))
        return global
        //   console.log('global',global)
    }
    const makeAllRelationTest = async (database,id) =>{
        let originalTable = await openFile(database)
        let findedOriginal = originalTable.find((f)=>f.id === id)
        let relationsTable = await databaseUtil.openCustomDatabase(database)
        let resursiveRela = await recursiveRelation(findedOriginal,relationsTable)
        // console.log('tttt',resursiveRela)
        //   console.log(resursiveRela)
        return {...findedOriginal,...resursiveRela}

        //return {'teste':'teste'}
    }
    // console.log(searchParams)
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
                        // let relationTable = await openFile(relat.table)

                        // if(!relationTable){
                        //     return
                        // }
                        // let relationFinded = relationTable.find((f)=>f.id === item[relat.key])
                        let teste = await makeAllRelationTest(relat.table,item[relat.key])
                        // console.log('key',relat.key,relat.table)
                        json[index] = {...json[index],[relat.key]:teste}

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
    var relationsParams
    if(req.query.relations){
        relationsParams = req.query.relations.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().split(' ');
    }
    let databaseConfig = await databaseUtil.openCustomDatabase(database)
    let relations = databaseConfig['relation']

    console.log(searchParams,relations)
    var regex = searchParams.map((item)=>{
        //teste.push({$regex:`^${item}`, $options : 'i'})
        return new RegExp( '^'+ item,'i' );
    })
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
    if(relationsParams && relations){
        await Promise.all(response.map(async (item,index)=>{
            await Promise.all(relations.map(async (relat)=>{
                if(relationsParams.includes(relat.table)){
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
                            response[index] = {...response[index],[relat.key]:tmpRelationArray}

                        }else{
                            let relationTable = await openFile(relat.table)

                            if(!relationTable){
                                return
                            }
                            let relationFinded = relationTable.find((f)=>f.id === item[relat.key])
                            response[index] = {...response[index],[relat.key]:relationFinded}

                        }

                    }
                }
            }))
        }))

    }

    return response
    //return json.find((item)=>item.tags == regex)
}
module.exports = {
    getDatabaseInfo,
    searchFinder
}