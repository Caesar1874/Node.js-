
var request = require("superagent");

function search(keyword, fn) {
    // superagent
    request.get("http://api.douban.com/v2/movie/search")
        .query({q: keyword})
        .end(function(err, res) {
            if(err) {
                console.log(err);
            } else {
                return fn(null, res.body);
            }
            fn(new Error("bad twitter response"));
        });
}

module.exports = search;


