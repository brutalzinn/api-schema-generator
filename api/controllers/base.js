
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
    if(!response){
      res.status(200).send({
        mensagem: `${id} can't be found on ${database} collection`
      });
    }
    return res.status(200).json(response)
  }
}
async function lista(database){
  
  return async (req,res,next) => {
    const response = await list(database)
    if(!response){
      res.status(200).send({
        mensagem: `Collection ${database} is empty`
      });
    }
    return res.status(200).json(response)
  }
}

async function editPost(database){
  return async (req,res,next) => {
    const { body } = req
   
      const response = await edit(database,body)
    
      if(!response){
       return res.status(200).send({
          mensagem: `${req.body.id} can't be found on ${database} collection`
        });
      }
    
      res.status(200).send({
        mensagem: "Post alterado com sucesso."
      });
    

  }
}

module.exports = {
  createPost,
  delPost,
  getPost,
  lista,
  editPost
}
