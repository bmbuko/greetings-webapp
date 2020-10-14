let express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const exphbs = require('express-handlebars');
const Greetings = require("./greet")
const bodyParser = require('body-parser');

const pg = require("pg")
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:pg123@localhost:5432/greet_people'

const pool = new Pool({
  connectionString
});

const greetings = Greetings(pool);

var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialise session middleware - flash-express depends on it
app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));
// initialise the flash middleware
app.use(flash());



app.get('/', async function (req, res){

try {
  var greetMessage = {
  
    counter: await greetings.counter(),
  }


  res.render('greet', {
    title: 'Home',
    greetMessage
  })
} catch (error) {
  console.log(error)
  
}
});

// app.get('/addFlash', function (req, res) {
//     req.flash('info', 'Flash Message Added');
//     res.redirect('/');
//   });

app.post("/greetings", async function (req, res) {
  try {
    console.log(req.body)
  const name = req.body.name
  const lang = req.body.language


  if (name === '' && lang === undefined) {
    req.flash('info', 'error, enter name and language!');
  }
  else if (lang === undefined) {
    req.flash('info', 'error,select language!');

  }
  else if (name === '') {
    req.flash('info', 'error,enter name!');
  }
  else {

    var msg = greetings.greet(name, lang)

   await greetings.addName(name);

    var greetMessage = {
  
      message: msg,
      counter: await greetings.counter(),
    }

  }
  // const countNames = req.body.countNames

  res.render("greet", {
    greetMessage
  });
  } catch (error) {
    console.log(error);
    
  }

});

app.get("/greeted", async function (req, res) {
  // console.log(greetings.storedNames());
  try {
    res.render("greeted", {
      greeted: await greetings.storedNames()
    })
  } catch (error) {
    console.log(error);
  }
});

app.get("/counter/:userName",async function (req, res) {
  try {
    const userName = req.params.userName;
  // console.log(greetings.userCounter(userName));
  // var names =greetings.counter(userName)
  res.render("greetings", {
    userName,
    count: await greetings.userCounter(userName)
  }
  )
  } catch (error) {
    console.log(error);

    
  }
  
})
app.get("/reset",async (req, res)=>{
  await greetings.resetData()
 res.redirect("/")
})




let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {

})