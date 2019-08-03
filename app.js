const express = require('express');
const bodyParser = require('body-parser');
var _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { get_date } = require(__dirname + '/date');
const app = express();
mongoose.connect('mongodb://localhost:27017/todoListDB', {useNewUrlParser: true});

const TodoItemSchema = new Schema({ title:  String, });
const TodoListSchema = new Schema({ title:  String, items: [TodoItemSchema]});
const TodoItem = mongoose.model('TodoItem', TodoItemSchema);
const TodoList = mongoose.model('TodoList', TodoListSchema);

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

const todoitem1 = new TodoItem({title: "Welcome to your Todo List"});
const todoitem2 = new TodoItem({title: "Hit the + button to add a Todo"});
const todoitem3 = new TodoItem({title: "<-- Hit this button to delete an item"});

app.get('/', (req, res) => {
  TodoItem.find((err, docs) => {
    if(docs.length == 0){
      TodoItem.insertMany([todoitem1, todoitem2, todoitem3], function(error, docs) {
        if(!err){ 
          console.log('default added successfully!!!!') 
          res.render('list', {
            name: "Home",
            title: get_date(),
            list: docs
          });
        }
      });
    }else{
      res.render('list', {
        name: "Home",
        title: get_date(),
        list: docs
      });
    }
  });
});

app.post('/', (req, res) => {
	const newItem = req.body.newItem;
  const name = req.body.name;

  if(name == 'Home'){
    if(newItem !== ''){
      const todoitem1 = new TodoItem({ title: newItem });
      todoitem1.save();
    }
    res.redirect('/');
  }else{
    if(newItem !== ''){
      const todoitem1 = new TodoItem({ title: newItem });
      TodoList.findOne({ title: name }, function (err, list) {
        console.log(list);
        list.items.push(todoitem1);
        list.save();
      });
    }
    res.redirect('/' + _.toLower(name));
  }
});

app.post('/delete', (req, res) => {
  const newID = req.body.id;
  const category = req.body.category;

  if(category == 'Home'){
    TodoItem.deleteOne({ _id:  newID}, function (err) {});
    res.redirect('/');
  }else{
    TodoList.findOne({ title: category }, function (err, list) {
      list.items = list.items.filter(item => {
        console.log(item._id != newID);
        return item._id != newID
      });
      console.log(list);
      list.save();
      res.redirect('/' + _.toLower(category));
    });
  }
});

app.get('/:category', function (req, res) {
  const category = _.capitalize(req.params.category);
  TodoList.findOne({title: category}, (err, doc) => {
    if(!doc){
      TodoList.create({title: category, items: [todoitem1, todoitem2, todoitem3]}, function (err, doc) {
        res.render('list', {
          name: category,
          title: category,
          list: doc.items
        });
      });
    }else{
      res.render('list', {
        name: category,
        title: category,
        list: doc.items
      });
    }
  })
})

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
