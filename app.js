const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://aboidrees:l2HEFjoXL56BN7NP@cluster0.y9s0s.mongodb.net/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
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

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

let listsForNav = [];



app.get('/', function(req, res) {
  List.find({}, function(err, foundListsForNav) {
    Item.find({}, function(err, items) {
      if (items.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('All items added successfully');
          }
        });
        res.redirect("/");
      } else {
        res.render('list', {
          listTitle: 'Today',
          listItems: items,
          lists: foundListsForNav,
        });
      }
    });
  });
});

app.get('/:customListName', function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.find({}, function(err, foundListsForNav) {

    List.findOne({
      name: customListName
    }, function(err, foundList) {
      if (!err) {
        if (!foundList) {
          // Create a new list
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          if (customListName !== "Favicon.ico") {
            list.save();
            res.redirect(`/${customListName}`);
          }
        } else {
          // show an existing list
          if (foundList.items.length === 0) {
            List.updateOne({
              name: customListName
            }, {
              items: defaultItems
            }, function(err) {
              if (!err) {
                res.redirect(`/${customListName}`);
              }
            });

          } else {
            res.render("list", {
              listTitle: foundList.name,
              listItems: foundList.items,
              lists: foundListsForNav,

            });
          }

        }
      }
    });
  });
});

app.post('/', function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect(`/${listName}`);
    })
  }
});

app.post('/delete', function(req, res) {
  const checkboxId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {

    Item.findByIdAndDelete(checkboxId, function(err) {
      if (!err) {
        console.log('successfully deleted checked item.');
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkboxId
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect(`/${listName}`);
      }
    });
  }
});

const port = process.env.PORT ? process.env.PORT : 3000;

app.listen(port, function() {
  console.log(`the Server is running on port ${port}`);
});