var ldap = require("ldapjs");

const HTTPS = require("https");
const FS = require("fs");
var XMLPARSER = require("jsontoxml");
var CSVPARSER = require("async-json2csv");

const express = require("express");
const router = express();
const port = 10200;

let clientSettings = {
  url: "ldap://<domain>:389",
  dc: "dc=<company>,dc=<tdl>",
  adminName: "<admin_name>",
  adminPW: "<admin_password>",
};

let client = ldap.createClient({url: clientSettings.url});

client.bind("cn=" + clientSettings.adminName + "," + clientSettings.dc, clientSettings.adminPW, function(err) {
  if(err != null) {
    console.error(err);
  }
});


router.listen(port, () => console.log("API started..."));


router.use(async function (req, res, next) {
  if(req.method == "OPTIONS"){
    res.writeHead(200, {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, DELETE", "Access-Control-Allow-Headers": "Content-Type"});
		res.send();
		return;
	}
	next();
});

router.get("/api/v1/auth/register", async (req, res) => {
  if(req.body != undefined) {
    let user = new User(req.body.mail, req.body.fname, req.body.lname, req.body.username, req.body.password);
    user.save(client);
  }else {
    sendError(req, res);
  }
});



async function sendError(req, res){
  let data = {"action": false};
  if(req.headers.accept.match("json")){
    res.writeHead(404, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
    res.write(JSON.stringify(data));
  }else if(req.headers.accept.match("xml")){
    res.writeHead(404, {"Content-Type": "text/xml", "Access-Control-Allow-Origin": "*"});
    res.write(XMLPARSER(data));
  }else if(req.headers.accept.match("csv")){
    res.writeHead(404, {"Content-Type": "text/csv", "Access-Control-Allow-Origin": "*"});
    res.write(await CSVPARSER({data: [data], fields: Object.keys(data), header: true}));
  }else{
    res.writeHead(404,  {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
    res.write("ERROR404 :/");
  }
}

async function sendJSONData(req, res, data){
  if(req.headers.accept.match("json")){
    res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
    res.write(JSON.stringify(data));
  }else if(req.headers.accept.match("xml")){
    res.writeHead(200, {"Content-Type": "text/xml", "Access-Control-Allow-Origin": "*"});
    res.write(XMLPARSER(data));
  }else if(req.headers.accept.match("csv")){
    res.writeHead(200, {"Content-Type": "text/csv", "Access-Control-Allow-Origin": "*"});
    res.write(await CSVPARSER({data: [data], fields: Object.keys(data), header: true}));
  }
}
