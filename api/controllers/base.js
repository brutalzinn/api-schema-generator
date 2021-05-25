
const {create,list,del,edit,get,getCustom} = require('../services/base.service');


function createPost(database){

return async (req,res,next) => {
    const { body } = req;
console.log('creating dybamic post..',database)
   await create(database,body)

    return res.status(200).send({
      mensagem: "Post registrado com sucesso."
    });
  }
}
  
  function delPost(database){
  return async (req, res, next) => {
 const {id} = req.params
 await del(id)
    return res.status(200).send({
      mensagem: "Post deletado com sucesso."
    });
    
  }
}
  

  function getPost(database){ 
  return async (req,res,next) => {
    const {id} = req.params
  const response = await get(id)
  
     return res.status(200).json(response)
    }
  }
  function lista(database){
  
  return async (req,res,next) => {
  const response = await list()

    return res.status(200).json(response)
  }
}

  function editPost(database){
  return async (req,res,next) => {
    const { body } = req;

    await edit(body)
    return res.status(200).send({
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
  