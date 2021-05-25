const tagsGenerator =  (model,toTags) =>{
    const regex = /[\s,\.;:\(\)\-']/
    let tags = []
    toTags.map((item)=>{
        if(model[item]){
            if(Array.isArray(model[item])){
                model[item].map((item)=>{
                    tags.push(...item.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase().trim().split(regex))   
                })
            }else{
                tags.push(...model[item].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase().trim().split(regex))   
            }
        }
    })
    return tags
}
module.exports = {
    tagsGenerator
}