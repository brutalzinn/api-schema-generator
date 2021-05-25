const {search,customFinder} = require('../../../controllers/search');


module.exports = (router) => {
    
    router.route('/search')
    .get(
        search
        )
        router.route('/search/find/:database/:column/:value')
        .get(
            customFinder
            )
        }
        