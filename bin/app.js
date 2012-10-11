var path = require('path');
var fs = require('fs');
var connect = require('connect');
var mongoskin = require('mongoskin');

var link = '127.0.0.1:27017/mynote?auto_reconnect=true';
var db = mongoskin.db(link);
var record = db.collection('record');

var app = connect();
app.use(connect.static(path.join(__dirname, "../")));
app.use(connect.directory(path.join(__dirname, "../")));
app.use(connect.query());
app.use(connect.bodyParser());
app.use("/data", function (req, res, next) {
  var id = req.query.id;
  res.setHeader('Content-Type', "application/json");
  fs.readFile(__dirname + '/data/' + id + '.json', function (err, file) {
    if (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({err: err.message}));
    }
    res.writeHead(200);
    res.end(file);
  });
});

app.use("/add", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  var body = req.body;
  body.created_at = new Date();
  record.insert(body, function () {
    res.end(JSON.stringify({}));
  });
});

app.use("/all", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  var body = req.body;
  body.created_at = new Date();
  record.find({}, {limit: 100}).toArray(function (err, list) {
    res.end(JSON.stringify(list));
  });
});

app.listen(process.argv[2]);
console.log("Running at http://localhost:" + process.argv[2]);