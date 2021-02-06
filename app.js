const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
const items = ['Buy Food', 'Cook Food', 'Eat Food'];
const workItems = [];
app.get('/', function (req, res) {
  res.render('list', {listTitle: date.getDay(), listItems: items});
});

app.post('/', function (req, res) {
  const item = req.body.newItem;

  if (req.body.list === 'Work List') {
    workItems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

app.get('/work', function (req, res) {
  res.render('list', {listTitle: 'Work List', listItems: workItems});
});

app.get('/about', function (req, res) {
  res.render('about');
});

const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, function () {
  console.log(`the Server is running on port ${port}`);
});
