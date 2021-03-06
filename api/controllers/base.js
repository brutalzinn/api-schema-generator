
const {create,list,del,edit,get,getCustom,keypairservice} = require('../services/base.service');
const {getLanguage} = require('../../cli/utils/language.utils')

async function createPost(database){

  return async (req,res,next) => {
    const { body } = req;
  const response = await create(database,body)
  let language = await getLanguage([database])
  if(!response){
    return res.status(200).send({
       mensagem: language['ERROR_UNEXPECTED']
     });
   }
    return res.status(200).send({
      mensagem: language['SUCESS_POST']
    });
  }
}
async function keypairtest(database){

  return async (req,res,next) => {
    const response = await keypairservice(database,req)
    const { key } = req.params
    let language = await getLanguage([key,database])
    if(!response){
     return res.status(200).send({
        mensagem: language['NOT_FOUND']
      });
    }
    return res.status(200).json(response)
  }

}

async function delPost(database){
  return async (req, res, next) => {
    const {id} = req.params
    const response = await del(database,id)
    let language =  getLanguage([id,database])
    console.log('del',id,database)
    if(!response){
      return res.status(404).send({
         mensagem: language['NOT_FOUND']
       });
     }
    return res.status(200).send({
      mensagem: language['SUCESS_DELETE']
    });

  }
}


async function getPost(database){
  return async (req,res,next) => {
    const {id} = req.params
    const response = await get(database,id)
    let language = await getLanguage([id,database])
    if(!response){
     return res.status(200).send({
        mensagem: language['NOT_FOUND']
      });
    }
    return res.status(200).json(response)
  }
}
async function lista(database){

  return async (req,res,next) => {
    const response = await list(database)
    let language = await getLanguage([database])
    console.log(database)
    if(!response){
     return res.status(200).send({
        mensagem: language['EMPTY']
      });
    }
    return res.status(200).json(response)
  }
}

async function editPost(database){
  return async (req,res,next) => {
    const { body } = req
    const {id} = body

      const response = await edit(database,body)
      let language = await getLanguage([id,database])

      if(!response){
       return res.status(200).send({
          mensagem: language['NOT_FOUND']
        });
      }

     return res.status(200).send({
        mensagem: language['SUCESS_UPDATE']
      });


  }
}

module.exports = {
  createPost,
  delPost,
  keypairtest,
  getPost,
  lista,
  editPost
}
