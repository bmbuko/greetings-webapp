module.exports = function route(greetings) {
  const display = async function (req, res) {

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
  };
  const greeting = async function (req, res) {
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

  };
  const user = async function (req, res) {
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

  }
  const greetedNames = async function (req, res) {
    // console.log(greetings.storedNames());
    try {
      res.render("greeted", {
        greeted: await greetings.storedNames()
      })
    } catch (error) {
      console.log(error);
    }
  };
  const deleteData = async (req, res) => {
    await greetings.resetData()
    res.redirect("/")
  }



  return {
    display,
    greeting,
    user,
    greetedNames,
    deleteData

  }
}
