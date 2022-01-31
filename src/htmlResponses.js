const fs = require('fs');
// pull in the file system module
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const page2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const page3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

const replyHtmlSuccess = (res, page) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(page);
  res.end();
};

const getIndex = (req, res) => {
  replyHtmlSuccess(res, index);
};

const getPage2 = (req, res) => {
  replyHtmlSuccess(res, page2);
};

const getPage3 = (req, res) => {
  replyHtmlSuccess(res, page3);
};

module.exports = { getIndex, getPage2, getPage3 };
