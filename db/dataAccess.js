const pool = require('./pool');

module.exports = {
    getUser: async () => {
        try {
            const res = await pool.query("select * from discord_user");
            console.table(res.rows);
            return res.rows;
        }
        catch {
            console("Something went wrong when Geting data")
        }
    },

    addUser: async (userTag) => {
        try {
            const insertUser = await pool.query("INSERT INTO discord_user (usertag,created_on) VALUES ($1,to_timestamp($2))", [userTag, Date.now() / 1000]);
        }
        catch (e) {
            console.log("Something went wrong when Inserting data");
        }
    },

    hasSayHello: async (userTag) => {
        try {
            const res = await pool.query("select  * from discord_user where usertag = $1 limit 1 ", [userTag]);
            console.log(res.rows[0]);
            return res.rows[0] == undefined ? false : true;
        }
        catch {
            console.log("Something went wrong when searching data");
            return false;
        }
    }
}