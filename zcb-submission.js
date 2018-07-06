const path = require('path');
const express = require('express');
const app = express();
const md5 = require('md5');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const nodemailer = require('nodemailer');
const smtpCredentials = require('./mail_config.json');
const smtpConfig = {
  host: smtpCredentials.host,
  port: 587,
  secure: true,
  auth: {
      user: smtpCredentials.user,
      pass: smtpCredentials.pass
  }
};

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

app.post('/quick', (req, res) => {
  let title = req.body.details.name+"'s Zero Carbon Bill Submission";
  let html = createHTML(req.body);
  let pdf = createPDF(html, function(file){
    sendMail({
      from: "\""+req.body.details.name+"\" <"+req.body.details.email+">",
      to: req.body.details.email,
      subject: title,
      html: html,
      attachments: [
        {
          filename: title+'.pdf',
          content: fs.createReadStream(file),
          contentType: 'application/pdf'
        }
      ]
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

function sendMail(options){
  
}

function sendMailTest(options){
  nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'tec5xsbajxrqsnl4@ethereal.email',
          pass: 'm8fqWTS2tNs3vQSHAZ'
      }
    });

    const mailOptions = options;
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
}
