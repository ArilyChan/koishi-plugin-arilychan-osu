const Cmd = require("../lib/Cmd")(true, true);

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", (line) => {
    try {
        let obj = Cmd.run(line)
        console.log(obj);
    }
    catch(ex) {
        console.warn(ex);
    }
});
