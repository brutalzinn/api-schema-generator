const {openFile,createModel,Insert,Update,Delete} = require('../utils/database.utils')
const { tagsUtil,tagsCreator,tagsUpdate,tagsSync } = require('../utils/tags.utils')

const create = async (database,body) => {
  //await Insert(database,createModel(body))
}
const edit = async (body) => {
await Update('post',body)
  await tagsSync('categoria','post','categoria')

}
const get = async (id) => {
  const json = await openFile('post')
  return json.find((item)=>item.id == id)
}
const getCustom = async (column,value) => {
  const json = await openFile('post')
  return json.find((item)=>item[column] == value)
}
const del = async (body) => {

await Delete('post',body)
}

const list = async (body) => {
 return await openFile('post')
}

module.exports = {
  create,
  list,
  del,
  get,
  getCustom,
  edit
}
