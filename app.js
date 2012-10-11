var path = require('path');
var fs = require('fs');
var connect = require('connect');
var mongoskin = require('mongoskin');

var generateMongoUrl = function () {
  var mongo;
  if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    mongo = env['mongodb-2.0'][0]['credentials'];
  } else {
    mongo = {
      "db": "mynote"
    };
  }

  mongo.hostname = (mongo.hostname || 'localhost');
  mongo.port = (mongo.port || 27017);
  mongo.db = (mongo.db || 'test');

  if (mongo.username && mongo.password) {
    return mongo.username + ":" + mongo.password + "@" + mongo.hostname + ":" + mongo.port + "/" + mongo.db;
  } else {
    return mongo.hostname + ":" + mongo.port + "/" + mongo.db;
  }
};

var db = mongoskin.db(generateMongoUrl());
var record = db.collection('record');

var app = connect();
app.use(connect.static(path.join(__dirname, "/public")));
app.use(connect.directory(path.join(__dirname, "/public")));
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

var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
app.listen(port, host);
console.log("Running at http://" + host + ":" + port);