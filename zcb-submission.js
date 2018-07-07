const path = require('path');
const express = require('express');
const app = express();
const md5 = require('md5');
const inlineCss = require('inline-css');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const nodemailer = require('nodemailer');
const emailCredentials = require('./mail_config.json');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailCredentials.user,
    pass: emailCredentials.pass
  }
});


const emailNotes = require('./email_notes.json');
const MFE = {
  name: "Ministry for the Environment",
  address: "mark.ls.metcalfe@gmail.com"
}

const fs = require('fs');
const pdf = require('html-pdf');
const options = {
  "directory": "/tmp",
  "format": "A4",
  "orientation": "portrait",
  "border": {
    "top": "2.54cm",
    "right": "2.54cm",
    "bottom": "2.54cm",
    "left": "2.54cm"
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
  createPDF(createHTML(req.body), function(file){
    let person = {
      name: req.body.details.name,
      address: req.body.details.email
    }
    let MFE_options = {
      from: person,
      replyTo: person,
      to: MFE,
      subject: title,
      html: emailNotes.for_recipient,
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
      html: emailNotes.for_sender+emailNotes.for_recipient,
      attachments: [
        {
          filename: title+'.pdf',
          content: fs.createReadStream(file),
          contentType: 'application/pdf'
        }
      ]
    };
    transporter.sendMail(MFE_options);
    transporter.sendMail(recipient_options, function(err,info){
      if(err) res.sendStatus(500);
      else res.sendStatus(200);
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
    html += "<section>";
    html += data.text[i];
    html += "</section>";
  }
  html += "</body></html>";
  return html;
}

function createPDF(html, done){
  let hash = md5(html);
  pdf.create(html, options).toFile('./tmp/'+hash+".pdf", function(err, res) {
    if (err) return console.log(err);
    else done(res.filename);
  });
}