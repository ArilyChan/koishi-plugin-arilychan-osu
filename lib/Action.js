const Page = require("./Page");
const Cmd = require("./Cmd");

class Action {
    constructor(config) {
        // 回复网址而不是网页截图，测试用
        this.replyUrl = config.replyUrl;
        // 数据库，绑定用
        this.database = config.database;
        // bancho的apiv1key，查询score用
        this.apiv1key = config.apiv1key;
        this.pagehelper = new Page(this.apiv1key);
        // 如果没有数据库，就不会注册setUser等相关指令，也就不会触发指令行为啦
        // score指令需要的apiv1key同理
        this.cmdhpr = Cmd(this.apiv1key, this.database);
    }

    async setUser(qid, server, user, mode) {
        //TODO check user
        if (!user) return "请指定玩家名字";
        let r = await this.database.add(qid, server, user, mode);
        if (r) return "绑定玩家" + user + "成功！";
        else return "绑定玩家" + user + "失败！";
    }

    async setMode(qid, server, user, mode) {
        //TODO check user
        if (!user) return "请先绑定玩家名字！";
        let r = await this.database.setmode(qid, server, user, mode);
        if (r) return "绑定模式" + mode + "成功！";
        else return "绑定模式" + mode + "失败！";
    }

    async unsetUser(qid, server) {
        let r = await this.database.del(qid, server);
        if (r) return "解绑成功！";
        else return "解绑失败！";
    }

    getParams(msg) {
        try {
            let params = this.cmdhpr.run(msg);
            if (!params.type && !params.help) return null;
            return params;
        }
        catch (ex) {
            return ex;
        }
    }

    async run(msg, qid) {
        try {
            let params = this.getParams(msg);
            // 非已注册指令
            if (!params) return "";
            // 错误信息
            if (typeof params === "string") return params;
            // 帮助指令
            if (params.help) return params.help;
            // 正常指令
            let server = params.server;
            if (!server) {
                console.warn("未能从指令中提取server，请检查代码");
                console.warn(params);
                return "";
            }
            let param = params.param;
            // 如有数据库，查询绑定信息补充user和mode
            if (this.database) {
                //TODO
                let datas = await this.database.find(qid, server);
                if (!param.user && datas && datas.user) param.user = datas.user;
                if (!param.mode && datas && datas.mode) param.mode = datas.mode;
            }
            let type = params.type;
            if (!type) {
                console.warn("未能从指令中提取type，请检查代码");
                console.warn(params);
                return "";
            }
            // 是否为需截图的指令
            if (this.pagehelper.checkSupport(type)) {
                let url = this.pagehelper.getPageUrl(type, server, params.param);
                if (this.replyUrl) return url;
                else return await this.pagehelper.screenshot(url);
            }
            // 检查是否是绑定账户指令
            if (type === "bind") {
                return await this.setUser(qid, server, param.user, this.pagehelper.modeParser(server, param.mode));
            }
            if (type === "setmode") {
                return await this.setMode(qid, server, param.user, this.pagehelper.modeParser(server, param.mode));
            }
            if (type === "unbind") {
                return await this.unsetUser(qid, server);
            }


            return "";
        }
        catch (ex) {
            return ex;
        }
    }
}

module.exports = Action;