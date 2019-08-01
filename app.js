const express = require('express');
const bodyParser = require('body-parser')

const { get_date } = require(__dirname + '/date');
const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

const list = [];

app.get('/', (req, res) => {
  	res.render('list', {
  		title: get_date(),
  		list: list
  	});
});

app.post('/', (req, res) => {
	const newItem = req.body.newItem;
	if(newItem !== ''){
		list.push(newItem);
	}
  	res.render('list', {
  		title: get_date(),
  		list: list
  	});
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
