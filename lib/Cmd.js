const { CommandHelper, CommandInfo, Param, dataType, param_mods } = require("chatcommand");
const bancho = { server: "bancho" };
const ppysb = { server: "sb" };
const mode = new Param("mode", ["#", "＃"], dataType.string, true);
const from = new Param("from", ["@from", "@start"], dataType.date);
const to = new Param("to", ["@to", "@end"], dataType.date);
const last = new Param("last", "@last", dataType.integer);
const np_user = new Param("user", [], dataType.string);
const np_index = new Param("index", [], dataType.integer, true);
const np_mode = new Param("mode", [], dataType.string, true);

const modeInfo_bancho = "官服可用mode：" + ['osu', 'taiko', 'fruit', 'mania'].join("/");
const modeInfo_sb = "sb服可用mode：" + ['osu', 'osuRX', 'osuAP', 'taiko', 'taikoRX', 'fruit', 'fruitRX', 'mania'].join("/");
const modsInfo = "可用mods：" + ["NF","EZ","TD","HD","HR","SD","DT","RX","HT","NC","FL","SO","AP","PF","1K","2K","3K","4K","5K","6K","7K","8K","9K","FI","RD","V2","MR",].join("/");

const bind = new CommandInfo("bind", ["bind", "set", "setid", "setuser"], ["绑定", modeInfo_bancho, modeInfo_sb, "示例：!setuser#mania dreamy"], [mode, np_user]);
const setmode = new CommandInfo("setmode", ["setmode", "mode"], ["设置默认模式", modeInfo_bancho, modeInfo_sb, "示例：!mode mania"], [np_mode]);
const unbind = new CommandInfo("unbind", ["unbind", "unset", "unsetid", "unsetuser"], ["取消绑定", "示例：!unset creamy"], [np_user]);
const stat = new CommandInfo("stat", ["stat", "info"], ["个人数据", modeInfo_bancho, modeInfo_sb, "示例：!stat#mania sweety"], [mode, np_user]);
const recent = new CommandInfo("recent", ["recent", "re"], ["最近成绩", modeInfo_bancho, modeInfo_sb, "示例：!recent#mania candy"], [mode, np_user]);
const recentpass = new CommandInfo("recentpass", ["pr"], ["最近pass成绩", modeInfo_bancho, modeInfo_sb, "示例：!pr#mania candy"], [mode, np_user]);
const userpage = new CommandInfo("userpage", ["userpage", "up"], ["玩家主页", "示例：!userpage darling"], [np_user]);
const best = new CommandInfo("best", ["best", "bp"], ["最好成绩", modeInfo_bancho, modeInfo_sb, "示例：!best#mania lover @from 2022-02-02 @to 2022-02-20"], [np_index, mode, from, to, last, np_user]);
const score = new CommandInfo("score", ["score", "s"], ["查询成绩", modeInfo_bancho, modeInfo_sb, modsInfo, "示例：!score#mania 1314520 myangel +HDDTHR"], [mode, param_mods, np_index, np_user]);

function createCmdHpr(hasApiV1, hasDatabase) {
    const cmdHpr = new CommandHelper(["!!", "！！", "?", "？", "*", "＊"], [bancho, bancho, bancho, bancho, ppysb, ppysb], ["help", "小阿日的说明文档：https://arilychan.github.io/"]);
    let commands = [
        stat,
        recent,
        // recentpass, 
        userpage,
        best,
    ];
    if (hasApiV1) commands.push(score);
    if (hasDatabase) commands.push(bind, setmode, unbind);
    return cmdHpr.add(commands);
}

module.exports = createCmdHpr;
