const baseController = require('../../controllers/base');
const {tagsHandler} = require('../../utils/middleware/tags.middleware')
const {saveFile,openFile} = require('../../utils/database.assist.utils')

module.exports = async (router) => {
var databases = await openFile('config')
return databases.map((data)=>{

  router.route(`/${data.database}`)
  .get(
    baseController.lista(data.database)
  )
  .post(tagsHandler(data.database),
    baseController.createPost(data.database)
  )
  .put(tagsHandler(data.database),
  baseController.editPost(data.database)
  )
  router.route(`/${data.database}/:id`)
  .delete(tagsHandler(data.database),
  baseController.delPost(data.database)
  )
  router.route(`/${data.database}/:id`)
  .get(
    baseController.getPost(data.database)
  )








})
 

    
  
  
  
  
  
  
  }
  