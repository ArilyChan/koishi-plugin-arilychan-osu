const Action = require("./lib/Action");
class OsuQuery{
    constructor(config) {
        this.action = new Action(config);
    }

    async apply(msg, qid) {
        let answer = await this.action.run(msg, qid);
        return answer;
    }
}

module.exports.OsuQuery = OsuQuery;
module.exports.name = 'koishi-plugin-arilychan-osu'
module.exports.apply = (ctx, options) => {
    let oq = new OsuQuery(options);

    ctx.middleware(async (meta, next) => {
        try {
            const message = meta.message;
            const userId = meta.userId;
            const reply = await oq.apply(message, userId);
            if (reply) await meta.send(reply);
            else return next();
        } catch (ex) {
            console.log(ex);
            return next();
        }
    });
}