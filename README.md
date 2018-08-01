# Zero Carbon Bill Submission Form
This app allows someone to easily build a form for creating a PDF, which can then be emailed to a specified email address as an attachment, with an email message too. I originally build this for [OraTaiao: New Zealand Climate & Health Council](http://www.orataiao.org.nz), to allow its members to easily make a submission on the Zero Carbon Bill. Despite being build for that purpose, it can be customised for any use. For a live demo of the app, please see [zerocarbonbillhealth.org.nz](https://zerocarbonbillhealth.org.nz).

## Getting Started
The form layout and components are defined with json files, found inside react/src. Multiple forms can be added, but they have to be defined in react/src/index.js. To build the React App, cd into react and run
```
npm run-script build
```
This will give you a build folder with all the code packaged up, ready for deployment wherever.

To set up the Node server, you will need to configure your credentials. You will need to configure your MySQL login credentials and database, as well as provide your Gmail login and password, and define who you want the emails to be delivered to. Once you have configured these settings, you can run the server with:
```
npm start
```
I strongly recommend you deploy both to a server under the same domain name, as the Node server does not nativley support cross origin requests for security reasons.

## Depenencies
<b>Frameworks</b>
- [React](https://reactjs.org)
- [Node](https://nodejs.org)

<b>Node Modules</b>
- [mysql](https://github.com/mysqljs/mysql)
- [express](https://github.com/expressjs/express)
- [bodyparser](https://github.com/expressjs/body-parser)
- [nodemailer](https://github.com/nodemailer/nodemailer)
- [node-html-pdf](https://github.com/marcbachmann/node-html-pdf)
- [inline-css](https://github.com/jonkemp/inline-css)
- [tempfile](https://github.com/sindresorhus/tempfile)
- [md5](https://github.com/pvorb/node-md5)
