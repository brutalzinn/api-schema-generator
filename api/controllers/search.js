

const {getDatabaseInfo,searchFinder} = require('../services/search.service');

  const search = (database) =>{
  return async (req,res,next) => {
  const response = await searchFinder(database,req)
  console.log('######TTTT',response)
     return res.status(200).json(response)
    }
  }


  const customFinder = (database) =>{
  
  return async (req,res,next) => {
  
  const response = await getDatabaseInfo(database, req)
  
     return res.status(200).json(response)
    }
  }

module.exports = {
    customFinder,
    search
}