var express = require('express')
var app = express()

app.get('/', function (req, res) {
res.send("Hello World!")
})

app.get('/update', function (req, res) {
res.send("update");
console.log('Got it!');
console.log(req.query);
console.log(typeof req.query);
console.log(typeof JSON.stringify(req.query));
console.log(typeof JSON.parse(JSON.stringify(req.query)));
console.log(typeof req.query.api_key);
console.log("Hello World!")
})

app.listen(3000, function () {
console.log('Example app listening on port 3000!')
})
