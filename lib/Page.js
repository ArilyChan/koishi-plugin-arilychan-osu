const GetScoreId = require("./GetScoreId");

class Page {
    constructor(apiv1key) {
        this.apiv1key = apiv1key;
        this.supportType = ["stat", "recent", "userpage", "best", "score"];
        this.server = ["bancho", "sb"];
        this.mode_osu = ['osu', 'taiko', 'fruit', 'mania'];
        this.mode_sb = ['osu', 'osuRX', 'osuAP', 'taiko', 'taikoRX', 'fruit', 'fruitRX', 'mania'];

        this.base_url = "https://info.osustuff.ri.mk/cn";
        this.lang = ["cn", "us"];
    }

    modeParser(server, modeString) {
        const std_equal = ["0", "s", "std", "standard", "click", "osu"];
        const std_include = ["泡泡"];
        const taiko_equal = ["1", "t", "taiko"];
        const taiko_include = ["鼓"];
        const ctb_equal = ["2", "c", "catch", "ctb", "fruit", "fruits"];
        const ctb_include = ["接"];
        const mania_equal = ["3", "m", "mania"];
        const mania_include = ["key", "骂娘", "琴"];

        if (!modeString) return undefined;
        let s = modeString.toString().trim().toLowerCase();
        let sp = "";
        if (server === "sb") {
            if (s.length > 2) {
                let special = s.substring(s.length - 2);
                if (special === "rx") {
                    sp = "RX";
                    s = s.substring(0, s.length - 2);
                }
                else if (special === "ap") {
                    sp = "AP";
                    s = s.substring(0, s.length - 2);
                }
            }
        }
        let mode = "";
        if (std_equal.some((kw) => kw === s)) mode = "osu" + sp;
        else if (taiko_equal.some((kw) => kw === s)) mode = "taiko" + sp;
        else if (ctb_equal.some((kw) => kw === s)) mode = "fruit" + sp;
        else if (mania_equal.some((kw) => kw === s)) mode = "mania" + sp;

        else if (std_include.some((kw) => s.indexOf(kw) >= 0)) mode = "osu" + sp;
        else if (taiko_include.some((kw) => s.indexOf(kw) >= 0)) mode = "taiko" + sp;
        else if (ctb_include.some((kw) => s.indexOf(kw) >= 0)) mode = "fruit" + sp;
        else if (mania_include.some((kw) => s.indexOf(kw) >= 0)) mode = "mania" + sp;

        if (server === "sb" && this.mode_sb.includes(mode)) return mode;
        else if (this.mode_osu.includes(mode)) return mode;
        else throw "不支持的模式：" + modeString;
    }

    modsParser(server, mode, mods) {
        let trueMods = mods;
        // 官服不会有默认AP、RX模式
        if (server === "sb" && mode && mode.length > 2) {
            // 检查有无AP、RX，如无则添加进去
            let sp = mode.substring(mode.length - 2);
            if (sp === "RX" && !(sp & 128)) {
                if (!trueMods) return 128;
                else trueMods += 128;
            }
            else if (sp === "AP" && !(sp & 8192)) {
                if (!trueMods) return 8192;
                else trueMods += 8192;
            }
        }
        return trueMods;
    }

    stat(server, user, mode) {
        if (!user) return "请指定玩家名，或绑定后才可省略";
        let ms = (mode) ? "/" + mode : "";
        return `${this.base_url}/users/${user}${ms}?server=${server}`;
    }

    date2param(date) {
        if (!date) return undefined;
        return date.getFullYear()+ "-" +date.getMonth() + "-" +date.getDate();
    }

    best(server, user, mode, dates) {
        if (!user) return "请指定玩家名，或绑定后才可省略";
        let ms = (mode) ? "/" + mode : "";
        let params = {
            server: server,
            startDate: this.date2param(dates.from),
            endDate: this.date2param(dates.to),
            startHoursBefore: dates.last,
            endHoursBefore: undefined
        };
        let p = new URLSearchParams(params);
        return `${this.base_url}/best/${user}${ms}?${p.toString()}`;
    }

    recent(server, user, mode) {
        if (!user) return "请指定玩家名，或绑定后才可省略";
        let ms = (mode) ? "/" + mode : "";
        return `${this.base_url}/recent/${user}${ms}?server=${server}`;
    }

    userpage(server, user) {
        if (!user) return "请指定玩家名，或绑定后才可省略";
        return `${this.base_url}/userpage/${user}?server=${server}`;
    }

    score(server, scoreId) {
        return `${this.base_url}/score/${scoreId}?server=${server}`;
    }

    async getScore(server, user, mode, mods) {
        try {
            let scoreId = await GetScoreId(this.apiv1key, server, user, mode, this.modsParser(server, mode, mods));
            if (!scoreId) return null;
            return this.score(server, scoreId);
        }
        catch (ex) {
            console.warn("获取scoreId失败：" + ex);
            return null;
        }
    }

    checkSupport(type) {
        return this.supportType.includes(type);
    }

    async getPageUrl(type, server, params) {
        if (type === "stat") return this.stat(server, params.user, this.modeParser(server, params.mode));
        if (type === "recent") return this.recent(server, params.user, this.modeParser(server, params.mode));
        if (type === "userpage") return this.userpage(server, params.user);
        if (type === "best") return this.best(server, params.user, this.modeParser(server, params.mode), params);
        if (type === "score") return await this.getScore(server, params.user, this.modeParser(server, params.mode), params.mods);
        console.warn("不支持的type: " + type + " ，赶紧查查哪里有漏洞了");
        return null;
    }

    async screenshot(url) {
        // TODO
        return url;
    }

}

module.exports = Page;
