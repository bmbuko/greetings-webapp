module.exports=function Greetings() {

    const namesList = {};

    function greet(name, language) {

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
    function addName(name) {
        if (namesList[name] === undefined) {
           namesList[name] = 0;
        }
        namesList[name]++

    }

    function counter() {
        return Object.keys(namesList).length;
    }
    function storedNames() {
        return namesList
    }

function userCounter(name) {
    for (var key in namesList) {
        // console.log(namesList[key])
        if (key === name ) {
            var value = namesList[key];
        }
    }
    return value;
}

    return {
        greet,
        addName,
        counter,
        storedNames,
        userCounter
    }
}

