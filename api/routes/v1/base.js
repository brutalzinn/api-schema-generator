const baseController = require('../../controllers/base');
const {tagsHandler} = require('../../utils/middleware/tags.middleware')
const {relationHandler} = require('../../utils/middleware/relations.middleware')
const {saveFile,openFile} = require('../../utils/database.assist.utils')

module.exports = async (router) => {
  const databases = await openFile('config')
  return await Promise.all(databases.map(async(data)=>{
    router.route(`/${data.database}`)
    .get(
      await baseController.lista(data.database)
      )
      .post(relationHandler(data.database),tagsHandler(data.database),
      await baseController.createPost(data.database)
      )
      .put(tagsHandler(data.database),
      await baseController.editPost(data.database)
      )
      router.route(`/${data.database}/:id`)
      .delete(
        await baseController.delPost(data.database)
        )
        router.route(`/${data.database}/:id`)
        .get(
          await baseController.getPost(data.database)
          )
        }))
      }
