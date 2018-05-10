const request = require("superagent")

request.get("http://api.douban.com/v2/movie/search")
    .query({q: "张艺谋"})
    .end(function(err, res) {
        console.log(res.body.subjects[0].title)
    }
);
