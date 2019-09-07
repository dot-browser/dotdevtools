const port = process.env.PORT || 3000;
const xml = require("xml");
const { create } = require("xmlbuilder");

var express = require("express");
var app = express();
app.use(express.json());

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready to go on http://localhost:${port}`);
});

process.env.NODE_ENV = "production";

app.get("/serve_file/@:file", (req, res, next) => {
  res.sendFile(__dirname + "/store/" + req.params.file + ".svg", err => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

app.use(function(req, res, next) {
  res.status(500);

  var error = create("Error");

  // prettier-ignore

  error
    .ele('Code')
    .txt('FileNotFound')
    .up()
    .ele('Message')
    .txt(`The server could not return the blob specified.`)
    .up()
    .ele('RequestDetails').att('Time', new Date().toISOString()).att('Status', parseInt(res.statusCode))

  res.set("Content-Type", "text/xml");
  res.send(error.toString({ pretty: true }));
});
