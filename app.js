const express = require('express');
const { result } = require('lodash');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { render } = require('ejs');


//express app
const app = express();
//connect to mongoDb 


const dbURI = 'mongodb://localhost:27017/blogdb';
mongoose.connect(dbURI)
 .then((result) => console.log('connected to db'))
 .catch((err) => console.log(err));
//register view engine
app.set('view engine', 'ejs');

//listen
const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`the app is using http://localhost:${PORT}`);
});

//middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

//routes
app.get('/', (req, res) =>{
    res.redirect('/blogs');
});

// handling post request
app.post('/blogs',(req,res) => {
    const blog = new Blog(req.body)
    blog.save()
    .then((result) => {
        res.redirect('/blogs');
       }) 
       .catch((err) => {
        console.log(err);
       });
});


app.get('/about', (req, res) =>{
   res.render('about', {title: 'About'});
});
//blog routes
app.get('/blogs', (req,res) => {
    Blog.find().sort({createdAt: -1})
           .then((result) => {
            res.render('index', {title: 'All-Blogs', blogs:result});
           }) 
           .catch((err) => {
            console.log(err);
           });
})

app.get('/blogs/create', (req, res) =>{
    res.render('create', {title: 'Create'});
 });
 app.delete('/blogs/:id', (req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result =>{
        
        res.json({redirect:'/blogs'});
        console.log('deleted successfully')
        
    })
    .catch(err => console.log(err));
 })
//redirects
app.get('/about-us', (req, res) =>{
    res.render('about', {title: 'About'});
 });
 app.get('/blogs/:id', (req,res)=>{
    const id =req.params.id;
    
     Blog.findById(id)
     .then(result =>{
        res.render('details',{blog: result, title:'Blog Details'});
     }).catch(err =>{
        console.log(err);
     });
})
// 404 page
app.use((req, res) =>{
    res.status(404).render('404', {title: '404'});
});
