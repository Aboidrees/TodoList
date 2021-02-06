const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: 'Welcome to your todolist!',
});
const item2 = new Item({
  name: 'Hit the + button to add a new item.',
});
const item3 = new Item({
  name: '<-- Hit this to delete an item',
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('All items added successfully');
//   }
// });

app.get('/', function (req, res) {
  Item.find({}, function(err, items){
    res.render('list', {listTitle: 'Today List', listItems: items});
  });
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
