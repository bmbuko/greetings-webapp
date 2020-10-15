const assert = require('assert');
const pg = require("pg");
const Pool = pg.Pool;
const Greetings = require("../greet")

const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:pg123@localhost:5432/greet_people_tests'

const pool = new Pool({
    connectionString

});

const greetings = Greetings(pool)



describe('The greetings', function () {

    beforeEach(async function () {

        // clean the tables before each test run
        await pool.query("delete from users;");


    });
    it("should be able to greet  Onako in English", function () {
        assert.equal("Morning, Onako", greetings.greet("Onako", "English"));
    });

    it("should be able to greet  Onako in Sotho", function () {
        assert.equal("Dumela, Onako", greetings.greet("Onako", "Sotho"));
    });

    it("should be able to greet  Onako in Afrikaans", function () {
        assert.equal("More, Onako", greetings.greet("Onako", "Afrikaans"));

    });


    it('should be able to add names to database and get user counter', async () => {
        await greetings.addName('Jan');
        await greetings.addName('Jan');
        await greetings.addName('Namhla');
        await greetings.addName('Aya');

        const counter = await greetings.userCounter('Jan')

        assert.equal(2, counter);

    });
    it("should be able to store name in the database", async () => {
        await greetings.addName('Lolo');
        await greetings.addName('Lolo');
        await greetings.addName('Mike');
        const stored = await greetings.storedNames()


        assert.deepEqual({ "Lolo": 2 ,"Mike":1}, stored);
    })
    it("should be able to add peoples names in the database  and get their counter ", async () => {
        await greetings.addName('Namhla');
        await greetings.addName('Sihle');
        await greetings.addName('Zola');
        const countee = await greetings.counter();
        assert.equal(3, countee);

    });
    it ("should be able to delete from database ", async ()=>{
        await greetings.addName('Namhla');
        await greetings.addName('Sihle');
        await greetings.addName('Zola');
        await greetings.resetData()
        const reset = await greetings.storedNames();
        assert.deepEqual({},reset);
    })



    after(function () {
        pool.end();
    })

});
