module.exports = function Greetings(pool) {

    //const namesList = {};

     function greet(name, language) {
         
         if(!language){
             return "enter lang"
         }

        if (language === "English") {
            return "Morning, " + name;
        }
        else if (language == "Sotho") {
            return "Dumela, " + name

        }
        else if (language === "Afrikaans") {
            return "More, " + name;
        }

    
    }



    async function addName(name) {

        // check if the name is in the db

        const checkingSQL = "select count(*) from users where Name = $1";
        const results = await pool.query(checkingSQL, [name])

        // console.log(results.rows.length);
        

        if (results.rows.length > 0 && results.rows[0].count == 0 ) {
            // if not in the db then insert it...

            const insertSQL = "insert into users( Name, counter ) values ($1, 1)"
            await pool.query(insertSQL, [name]);

        } else {
            // otherwise update the counter.

            const updateSQL = "update users set counter = counter + 1 where Name = $1;";
            await pool.query(updateSQL, [name]);

        }


        // if (namesList[name] === undefined) {
        //     namesList[name] = 0;
        // }
        // namesList[name]++

    }

    async function counter() {
        // return Object.keys(namesList).length;
        const sql = "select * from users";
        const results = await pool.query(sql);
        return results.rows.length
    }

    async function storedNames() {

        const sql = "select * from users";
        const results = await pool.query(sql);

        const userObject = {};

        results.rows.forEach(function (user) {
            userObject[user.name] = user.counter
        });
        return userObject;
    }

    async function userCounter(name) {
        const checkingSQL = "select * from users where name = $1";
        const results = await pool.query(checkingSQL, [name])
        return results.rows[0]["counter"]

        // for (var key in namesList) {
        //     // console.log(namesList[key])
        //     if (key === name) {
        //         var value = namesList[key];
        //     }
        // }
        // return value;

    }



    return {
        greet,
        addName,
        counter,
        storedNames,
        userCounter,
        
    }
}

