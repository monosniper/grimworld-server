const Rcon = require("rcon");

const HOST = "193.164.17.36";
const PORT = 25333;
const PASSWORD = "QDFv0YHPGX625HkDkCQI";

class RCON {
    constructor() {
        const options = {
            tcp: false,
            challenge: false
        }
        this.client = new Rcon(HOST, PORT, PASSWORD);
        this.authenticated = false;
        this.queuedCommands = []
        const _this = this

        this.client.on('auth', function() {
            _this.authenticated = true;

            for (let i = 0; i < _this.queuedCommands.length; i++) {
                _this.client.send(_this.queuedCommands[i]);
            }
            _this.queuedCommands = [];

        }).on('end', function() {
            process.exit();
        });

        try {
            this.client.connect();
        } catch {
            console.log('Cant connect to RCON')
        }
    }

    async makeCommand(command) {
        if (this.authenticated) {
            this.client.send(command);
        } else {
            this.queuedCommands.push(command);
        }
    }
}

module.exports = new RCON()