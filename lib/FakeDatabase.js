// 前期测试框架用
class FakeDatabase {
    constructor() {
        this.dist = {};
    }

    async add(qid, server, user, mode) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.dist[qid]) this.dist[qid] = {};
                if (this.dist[qid][server]) throw "你已经绑定过账号了！";
                this.dist[qid][server] = {
                    user,
                    mode,
                }
                resolve(true);
            }, 100)
        });
    }

    async setmode(qid, server, user, mode) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.dist[qid]) throw "你还未绑定账号";
                if (!this.dist[qid][server]) throw "你还未绑定账号";
                this.dist[qid][server].mode = mode;
                resolve(true);
            }, 100)
        });
    }

    async del(qid, server) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.dist[qid]) throw "你还未绑定账号";
                if (!this.dist[qid][server]) throw "你还未绑定" + server + "账号";
                this.dist[qid][server] = {};
                resolve(true);
            }, 100)
        });
    }

    async find(qid, server) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.dist[qid]) resolve(null);
                else if (!this.dist[qid][server]) resolve(null);
                else resolve(this.dist[qid][server]);
            }, 1000)

        });
    }
}

module.exports = FakeDatabase;
