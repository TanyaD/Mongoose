var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var moment = require('moment')
app.use(bodyParser.urlencoded({extended:true}));
app.set('views', __dirname+ '/views');
app.set('view engine', 'ejs');
var session = require('express-session');
app.use(session({secret:'codingdojo'}));

app.get('/',function(request,response){
    Dog.find({}).exec(function(err,dogs){
    response.render("index", {dogs})
    })
})
app.get('/new',function(request,response){
    response.render("new")
    })
app.post('/show', function(req, res){
    console.log("POST DATA", req.body);
    var dog=new Dog({name:req.body.name, breed:req.body.breed});
    dog.save(function(error){
        if(error){
            res.render('new', {errors:dog.errors})
        }
        else{
            console.log("success");
            res.redirect('/')
        }
    })
})

app.get('/dogs/:id', function(req,res){

    Dog.find({_id:req.params.id},function(err,dog){
        
    console.log(dog)
    res.render("show",{dog:dog[0]})
    })
})
app.post('/destroy/:id', function(req,res){
    
        Dog.remove({_id:req.params.id},function(err,dog){
            
        console.log(dog)
        res.redirect("/")
        })
})
app.get('/update/:id', function(req, res){
	Dog.find({ _id: req.params.id }, function(err, dog){
		if (err){
			console.log(err);
		} else {
			res.render('update', {dog: dog[0]});
		}
    });
})
app.post('/update/:id', function(req,res){
    
        Dog.update({_id:req.params.id},req.body,function(err,dog){
            
        console.log(dog)
        res.redirect("/")
        })
})


mongoose.connect('mongodb://localhost/dog_db');
var DogSchema = new mongoose.Schema({
    name: {type:String, required:true, minlength:2},
    breed: {type:String, required:true, minlength:2}
},  {timestamps: true})
mongoose.model('Dogs', DogSchema);
var Dog = mongoose.model('Dogs')
mongoose.Promise = global.Promise;

app.listen(8000, function(){
    console.log("listening on port 8000");
})