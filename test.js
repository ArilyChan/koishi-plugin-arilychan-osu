const OsuQuery = require("./index").OsuQuery;
const FakeDatabase = require("./lib/FakeDatabase");

let oq = new OsuQuery({ replyUrl: true, database: new FakeDatabase(), apiv1key: "" });

async function ask(qid, msg) {
    console.log(qid + ": " + msg);
    try {
        console.log(await oq.apply(msg, qid));
    }
    catch(ex) {
        console.warn(ex);
    }
}

async function test() {
    await new Promise((resolve)=> {resolve(true)}).then(
    (await ask(337845818, "!!bind exsper"))).then(
    (await ask(337845818, "!!mode mania"))).then(
    (await ask(337845818, "!!stat#taiko"))).then(
    (await ask(337845818, "!!userpage"))).then(
    (await ask(337845818, "!!recent#骂娘"))).then(
    (await ask(337845818, "!!best2#戳泡泡"))).then(
    (await ask(337845818, "!!best#打鼓 @from 2022-02-02 @to 2022-04-04"))).then(
    (await ask(337845818, "*recent#骂娘"))).then(
    (await ask(337845818, "!!unset"))).then(
    (await ask(337845818, "!!recent exsper"))).then(
    (await ask(337845818, "!!recent"))).then(
    (await ask(41888438, "*recent"))).then(
    (await ask(41888438, "*setUSER candy"))).then(
    (await ask(41888438, "*setmode osuRX"))).then(
    (await ask(41888438, "*recent"))).then(
    (await ask(41888438, "*help"))).then(
    (await ask(41888438, "*help best")))
}

test();