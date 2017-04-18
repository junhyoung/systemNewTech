var express = require('express')
var app = express()
fs = require('fs');
mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'sensor',
    password: 'mypassword',
    database: 'data'
})
connection.connect();


app.get('/graph', function (req, res) {
    console.log('got app.get(graph)');
    var html = fs.readFile('./graph.html', function (err, html) {
    html = " "+ html
    console.log('read file');

    var qstr = 'select * from sensors ';
    connection.query(qstr, function(err, rows, cols) {
      if (err) throw err;

      var data = "";
      var comma = ""
      for (var i=0; i< rows.length; i++) {
         r = rows[i];
	t=r.time+"";
	//console.log(t.substring(4,7));
	 //console.log(t.substring(22,25));
	var tmp;
         //tmp= comma + "[new Date(2017,04-1,"+ r.id +",00,38),"+ r.value +"]";
	//console.log(tmp);
	 //var tmp;
	tmp= comma + "[new Date("+t.substring(11,15)+",04-1,"+t.substring(8,10)+","+t.substring(16,18)+","+t.substring(19,21)+","+t.substring(22,24)+"),"+ r.value +"]";
	 //console.log(tmp);
	 data+=tmp;
      //   data +=comma+"[new Date("+r.time.getYear()+","+r.time.getMonth()+"-"+r.time.getDay()+r.id+",00,38),"+r.value+"]";
	 comma = ",";
      }
      var header = "data.addColumn('date', 'Date');"
      header += "data.addColumn('number', 'Temp');"
      html = html.replace("<%HEADER%>", header);
      html = html.replace("<%DATA%>", data);

      res.writeHeader(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
      console.log("READ END")
    });
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
