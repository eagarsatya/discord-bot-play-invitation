const pool = require('./pool');

function getCurrentTime() {
    return Date.now() / 1000;
}

module.exports = {
    getUser: async () => {
        try {
            const res = await pool.query("select * from discord_user");
            return res.rows;
        }
        catch {
            console("Something went wrong when Geting data")
        }
    },

    addUser: async (userTag) => {
        try {
            const insertUser = await pool.query("INSERT INTO discord_user (usertag,created_on) VALUES ($1,to_timestamp($2))", [userTag, getCurrentTime()]);
        }
        catch (e) {
            console.log("Something went wrong when Inserting data");
        }
    },

    hasSayHello: async (userTag) => {
        try {
            const res = await pool.query("select  * from discord_user where usertag = $1 limit 1 ", [userTag]);
            return res.rows[0] == undefined ? false : true;
        }
        catch {
            console.log("Something went wrong when searching data");
            return false;
        }
    },

    createPlayInvitation: async (userId, whenToPlay, channelId, game) => {
        try {
            await pool.query("BEGIN");
            const queryHeader = 'INSERT INTO play_invitation(user_id, channel_id,game,created_on,play_time) VALUES($1,$2,$3,to_timestamp($4),to_timestamp($5)) RETURNING play_invitation_id';
            const valueHeader = [userId, channelId, game, getCurrentTime(), whenToPlay];
            const result = await pool.query(queryHeader, valueHeader);

            const queryParticipant = 'INSERT INTO play_invitation_participant(play_invitation_id,user_id,created_on) VALUES($1,$2,to_timestamp($3))'
            const valueParticipant = [result.rows[0].play_invitation_id, userId, getCurrentTime()];
            await pool.query(queryParticipant, valueParticipant);

            await pool.query('COMMIT')
            return true;
        }
        catch (e) {
            console.log("Something went wrong when creating invitation data");
            await pool.query('ROLLBACK')
            return false;
        }
    },

    findPlayInvitation: async (channelId) => {
        try {
            const res = await pool.query("select * from play_invitation where channel_id = $1", [channelId]);
            return res.rows;
        }
        catch {
            console.log("Something went wrong when gettind Play Invitation");
            return null;
        }
    },

    findPlayInvitationDetail: async (channelId) => {
        try {
            const res = await pool.query(`select format('<@%s>',pip.user_id) as userid, pip.created_on as jointime, pi.game, pi.play_time as playtime
            from play_invitation pi join play_invitation_participant pip on pi.play_invitation_id = pip.play_invitation_id
            where pi.channel_id = $1`, [channelId]);
            return res.rows;
        }
        catch {
            console.log("Something went wrong when gettind Play Invitation");
            return null;
        }
    },

    insertParticipant: async (playInvitationId, userId) => {
        try {
            await pool.query("insert into play_invitation_participant (play_invitation_id, user_id, created_on) VALUES ($1,$2,to_timestamp($3))", [playInvitationId, userId, getCurrentTime()]);
            return true;
        }
        catch (e) {
            console.log("Something went wrong when Inserting data");
            return false;
        }
    }

}