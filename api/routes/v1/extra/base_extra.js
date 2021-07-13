const baseController = require('../../../controllers/base');
const {openFile} = require('../../../utils/config.utils')

module.exports = async (router) => {
  const databases = await openFile('config')
  return await Promise.all(databases.map(async(data)=>{
      router.route(`/${data.database}/:key/:value`)
      .get(
        await baseController.keypairtest(data.database)
        )
            }))
          }
