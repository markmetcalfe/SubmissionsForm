const path = require('path');
const express = require('express');
const app = express();
const md5 = require('md5');
const inlineCss = require('inline-css');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mysql_credentials = require('./mysql_credentials.json');
const mysql_lib = require('mysql');
const mysql = mysql_lib.createConnection({
  host: mysql_credentials.host,
  user: mysql_credentials.user,
  password: mysql_credentials.password,
  database: mysql_credentials.database
});
mysql.connect(function(err) {
  if (err) throw err;
  console.log("Connected to "+mysql_credentials.database+" database.");
});

const nodemailer = require('nodemailer');
const gmailCredentials = require('./gmail_credentials.json');
const emailConfig = require('./email_config.json');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailCredentials.user,
    pass: gmailCredentials.pass
  }
});

const fs = require('fs');
const pdf = require('html-pdf');
const options = {
  "directory": "/pdfs",
  "format": "A4",
  "orientation": "portrait",
  "border": {
    "top": "2.5cm",
    "right": "2.5cm",
    "bottom": "2.5cm",
    "left": "2.5cm"
  },
  "type": "pdf"
}
const stylesheet = fs.readFileSync('pdf_formatting.css', 'utf8');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  next(); 
});

app.post('/', (req, res) => {
  let title = req.body.details.name+"'s Zero Carbon Bill Submission";
  let html = createHTML(req.body);
  let hash = md5(html);
  insertIntoDatabase(req.body.details, hash, req.body.type);
  createPDF(html, hash, function(file){
    let person = {
      name: req.body.details.name,
      address: req.body.details.email
    }
    let MFE_options = {
      from: person,
      replyTo: person,
      to: emailConfig.recipient,
      subject: title,
      html: emailConfig.notes.for_recipient+req.body.details.name,
      attachments: [
        {
          filename: title+'.pdf',
          content: fs.createReadStream(file),
          contentType: 'application/pdf'
        }
      ]
    };
    let recipient_options = {
      from: person,
      replyTo: person,
      to: person,
      subject: "Your Submission on the Zero Carbon Bill",
      html: emailConfig.notes.for_sender+emailConfig.notes.for_recipient+req.body.details.name,
      attachments: [
        {
          filename: title+'.pdf',
          content: fs.createReadStream(file),
          contentType: 'application/pdf'
        }
      ]
    };
    transporter.sendMail(MFE_options, function(err,info){
      if(err) res.sendStatus(500);
      else transporter.sendMail(recipient_options, function(err,info){
        if(err) res.sendStatus(500);
        else {
          console.log("Email sent.");
          res.sendStatus(200);
        }
      });
    });
  });
});

app.listen(8003, () => console.log("listening on 8003"));

function createHTML(data){
  let html = "<html><head><style>"+stylesheet+"</style></head><body><section>";
  let date = new Date();
  html += date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
  html += "</section>";
  for(let i=0; i<data.text.length; i++){
    html += data.text[i];
  }
  html += "</body></html>";
  return html;
}

function createPDF(html, filename, done){
  pdf.create(html, options).toFile('./pdfs/'+filename+".pdf", function(err, res) {
    if (err) return console.log(err);
    else done(res.filename);
  });
}

function insertIntoDatabase(details, filename, type){
  let query = "insert into submission (name, email, phone, filename, type) \
    values ('"+details.name+"', '"+details.email+"', '"+details.phone+"', '"+filename+"', '"+type+"');";
  mysql.query(query, function (err, result) {
    if(err) console.log("Error adding database rows");
    else console.log("Added submission to database.");
  });
}