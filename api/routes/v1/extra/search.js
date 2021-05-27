const {search,customFinder} = require('../../../controllers/search');
const {saveFile,openFile} = require('../../../utils/database.assist.utils')



module.exports = async (router) => {
    const databases = await openFile('config')
    return await Promise.all(databases.map(async(data)=>{
        
        router.route(`/${data.database}/search`).get(
            search(data.database)
            )

            if(data['relation']){
                router.route(`/${data.database}/extra`).get(
                    customFinder(data.database)
                    )
            }
   
                
                
            }))
        }
        