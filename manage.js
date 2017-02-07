// Commands
(function () {
    var manage = require('./cmds');

    switch (process.argv[2]) {
        case "createsuperuser": {
            manage.createsuperuser();
            break;
        }
        default: {
            console.log("Commands available:");
            for (var cmd in manage) {
                if (manage.hasOwnProperty(cmd)) {
                    console.log("\t" + cmd);
                }
            }
        }
    }
})();
