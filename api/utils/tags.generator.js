function isArray(obj){
    return !!obj && obj.constructor === Array;
}
const tagsGenerator =  (model) =>{
    const regex = /[\s,\.;:\(\)\-']/
    let toTags = process.env.TAGS_ATTRIBUTES.split(' ');

    let tags = []
    toTags.map((item)=>{
        if(model[item]){
console.log(Array.isArray(model[item]),item)
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