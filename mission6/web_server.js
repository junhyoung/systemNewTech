/*
 * 2016/11/20 Kyuho Kim
 * GET으로 호출하는 경우.
 * http://localhost:8080/logone?user=202&serial=6&format=2&items=0-T-22.65,2-D-45.32,0-C-452
 * 
 * POST의 경우,  
 * http://localhost:8080/logone?user=202&serial=6&format=2 와 함께 
 * header는
 * 'Content-Type: application/x-www-form-urlencoded\r\n' 
 * body는 
 * items=0-T-22.65,2-D-45.32,0-C-452
*/

var express = require('express');
var app = express();
bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var fs = require("fs");
var df = require('dateformat');
mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'sensor',
    password: 'mypassword',
    database: 'data'
})
connection.connect();


function insert_sensor(temp,user, type, value, user2, serial, ip)
{
  obj = {};
  obj.user = user;
  obj.type = type;
  obj.value = value;
  obj.user2 = user2;
  obj.serial = serial;
  obj.ip = ip
  obj.date = df(new Date(), "yyyy-mm-dd HH:MM:ss");
  var d = JSON.stringify(obj);
  ret = " "+ type + user2 +"="+ value;
  //console.log("RET "+ ret);

  fs.appendFile("Data.txt", 'Temperature : '+temp+'\n', function(err) {
    if(err) console.log("File Write Err: %j", r);
  });
  return(ret);
}
function makeObject(temp){
  r={};
  r.seq=1;
  r.type='T';
  r.device='ds18b20';
  r.unit='0';
  r.ip="10.42.0.203";
  r.value=temp;

}
function do_get_post(cmd, r, req, res)
{
  console.log(cmd +" %j", r);
  ret_msg = "{serial:"+ r.serial +",user:"+ r.user;
  //fs.appendFile("Data.txt", 1, function(err) {
    //if(err) console.log("1File Write Err: %j", r);
  //});

  if (r.format == '2') {
    //console.log("got format 2");
    var items = r.items.split(',');
    for (var i=0; i< items.length; i++) {
      if (items[i].length < 3) continue;
      var v = items[i].split('-');
          ret_msg += insert_sensor(r.temp,r.user, v[1], v[2], v[0], r.serial, req.connection.remoteAddress);
    }
  }
  ret_msg += "}";

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('X-ACK:' + ret_msg);
}

app.get('/logone', function(req, res) {
  r = req.query;
  fs.appendFile('Data.txt',"Tempertature : "+r.temp+'\n',function(err){});
  //console.log("GET %j", r);
  a={};
a.seq=1;
a.type='T';
a.device='102';
a.unit='0';
a.ip="192.168.0.2";
a.value=r.temp;

  var query = connection.query('insert into sensors set ?',a, function(err, rows,cols){
  if (err) throw err;
  //console.log("done");
  //process.exit();
});

  do_get_post("GET", r, req, res);
});

app.post('/logone', function(req, res) {
  r = req.body;
  //console.log("POST %j", r);
  do_get_post("POST", r, req, res);
});

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});
