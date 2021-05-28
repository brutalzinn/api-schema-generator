const {openFile,createModel,Insert,Update,Delete} = require('../utils/database.utils')
const { tagsUtil,tagsCreator,tagsUpdate,tagsSync } = require('../utils/tags.utils')
const databaseConfig = require('../utils/database.assist.utils')
const {relationSync} = require('../utils/tags.relation.assist.utils')
const create = async (database,body) => {
  const created = await Insert(database,createModel(body))
return created
}
const edit = async (database,body) => {
  const {id} = body
  const update = await Update(database,body)
  console.log('update',update)
  await relationSync(database,{...body,id})
  return update

}
const get = async (database,id) => {
  const json = await openFile(database)
  return json.find((item)=>item.id == id) || false
}
const getCustom = async (column,value) => {
  const json = await openFile(database)
  return json.find((item)=>item[column] == value)
}
const del = async (database,id) => {
 const deleteDb = await Delete(database,id)
  if(!deleteDb){
    return false
  }
  await relationSync(database,{id})
}

const list = async (database) => {
  let response = await openFile(database)
  if(response.length == 0){
    return false
  }
  return response
}

module.exports = {
  create,
  list,
  del,
  get,
  getCustom,
  edit
}
