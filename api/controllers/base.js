
const {create,list,del,edit,get,getCustom} = require('../services/base.service');


async function createPost(database){
  
  return async (req,res,next) => {
    const { body } = req;
  const response = await create(database,body)
  console.log('created',response)
  if(!response){
    return res.status(200).send({
       mensagem: `A unexpected error on ${database} collection`
     });
   }
    return res.status(200).send({
      mensagem: `successful registred ${database} collection`
    });
  }
}

async function delPost(database){
  return async (req, res, next) => {
    const {id} = req.params
    const response = await del(database,id)
    if(!response){
      return res.status(200).send({
         mensagem: `${req.body.id} can't be found on ${database} collection`
       });
     }
    return res.status(200).send({
      mensagem: `${req.body.id} successful deleted ${database} collection`
    });
    
  }
}


async function getPost(database){ 
  return async (req,res,next) => {
    const {id} = req.params
    const response = await get(database,id)
    if(!response){
     return res.status(200).send({
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
     return res.status(200).send({
        mensagem: `Collection ${database} is empty`
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
    
      if(!response){
       return res.status(200).send({
          mensagem: `${id} can't be found on ${database} collection`
        });
      }
    
     return res.status(200).send({
        mensagem: `${id} successful updated ${database} collection`
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
