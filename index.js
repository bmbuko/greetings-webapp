let express = require('express');
const flash = require('express-flash');
const route =require("./routes");
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
const routing =route(greetings)

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



app.get('/',routing.display)

// app.get('/addFlash', function (req, res) {
//     req.flash('info', 'Flash Message Added');
//     res.redirect('/');
//   });

app.post("/greetings",routing.greeting)
app.get("/greeted",routing.greetedNames)
app.get("/counter/:userName",routing.user)
app.get("/reset",routing.deleteData)




let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {

})