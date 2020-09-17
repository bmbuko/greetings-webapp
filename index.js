let express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const exphbs = require('express-handlebars');
const Greetings = require("./greet")
const bodyParser = require('body-parser');



let app = express();
const greetings = Greetings()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
  // initialise session middleware - flash-express depends on it
  app.use(session({
    secret : "<add a secret string here>",
    resave: false,
    saveUninitialized: true
  }));

  // initialise the flash middleware
  app.use(flash());
  app.get('/', function (req, res) {
  
    res.render('greet', {
      title: 'Home'
    })
  });

// app.get('/addFlash', function (req, res) {
//     req.flash('info', 'Flash Message Added');
//     res.redirect('/');
//   });

app.post("/greetings", function (req, res) {
    const name = req.body.name
    const lang = req.body.language
  if (  name === '' && lang === undefined) {
    req.flash('info', 'error, enter name and language!');
  }
  else if (lang === undefined) {
    req.flash('info', 'error,select language!');

  }
  else if (name === '') {
    req.flash('info', 'error,enter name!');
  }
  else{
    var greetMessage = {
         message: greetings.greet(name, lang),
        countNames:greetings.addName(name),
        counter: greetings.counter(),
    }

  }
    // const countNames = req.body.countNames

    res.render("greet", {
        greetMessage
    });

});
app.get("/greeted",function(req,res){
    console.log(greetings.storedNames());
    res.render("greeted",{
      greeted: greetings.storedNames()  
    })
})
app.get("/counter/:userName",function(req,res){
    const userName = req.params.userName;
    // console.log(greetings.userCounter(userName));
   // var names =greetings.counter(userName)
    res.render("greetings",{ userName, 
    count: greetings.userCounter(userName) }
    )
})




let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {

})