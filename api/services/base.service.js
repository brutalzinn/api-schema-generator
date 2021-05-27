const {openFile,createModel,Insert,Update,Delete} = require('../utils/database.utils')
const { tagsUtil,tagsCreator,tagsUpdate,tagsSync } = require('../utils/tags.utils')
const databaseConfig = require('../utils/database.assist.utils')
const {relationSync} = require('../utils/tags.relation.assist.utils')
const create = async (database,body) => {
  await Insert(database,createModel(body))
}
const edit = async (database,body) => {
  await Update(database,body)
  console.log('meu body',body)
 await relationSync(database,body)
  // let customDatabase = await databaseConfig.openCustomDatabase(database)
  // if(customDatabase['relation']){
  //   return await Promise.all(customDatabase['relation'].map(async (item)=>{
  //     await tagsSync(item.table,database,item.key,id)
  //   }))  
  // }
  
  // await tagsSync('categoria','post','categoria')
}
const get = async (database,id) => {
  const json = await openFile(database)
  return json.find((item)=>item.id == id)
}
const getCustom = async (column,value) => {
  const json = await openFile(database)
  return json.find((item)=>item[column] == value)
}
const del = async (database,id) => {
 await Delete(database,id)
  await relationSync(database,{id})
}

const list = async (database) => {
  return await openFile(database)
}

module.exports = {
  create,
  list,
  del,
  get,
  getCustom,
  edit
}
