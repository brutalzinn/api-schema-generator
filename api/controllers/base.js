
const {create,list,del,edit,get,getCustom} = require('../services/base.service');


async function createPost(database){
  
  return async (req,res,next) => {
    const { body } = req;
    await create(database,body)
    return res.status(200).send({
      mensagem: "Post registrado com sucesso."
    });
  }
}

async function delPost(database){
  return async (req, res, next) => {
    const {id} = req.params
    await del(database,id)
    return res.status(200).send({
      mensagem: "Post deletado com sucesso."
    });
    
  }
}


async function getPost(database){ 
  return async (req,res,next) => {
    const {id} = req.params
    const response = await get(database,id)
    
    return res.status(200).json(response)
  }
}
async function lista(database){
  
  return async (req,res,next) => {
    const response = await list(database)
    
    return res.status(200).json(response)
  }
}

async function editPost(database){
  return async (req,res,next) => {
    const { body } = req
    try{
      await edit(database,body)
      res.status(200).send({
        mensagem: "Post alterado com sucesso."
      });
    }catch(exception){
      res.status(200).send({
        mensagem: exception
      });
    }

  }
}

module.exports = {
  createPost,
  delPost,
  getPost,
  lista,
  editPost
}
