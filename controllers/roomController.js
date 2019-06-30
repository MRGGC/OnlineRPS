const funcs = require('./../funcs');
const cookieExpireTime = 20 * 60 * 1000; // Expiration of cookie 'last' -> 20m
const dir = "/room/";
let rooms = {};

// Redirecting to '/random' while not getting free room
function roomFilter(req, res, next) {
    let room = req.params.id.toLowerCase().trim();

    if (room == "random") {
        let id = funcs.getFreeRoom(rooms); // getting free random room

        return res.redirect(dir + (id === -1 ? funcs.generateRoomName() : id) + "?t=1"); // if no free random room exists -> generating a random room
    }

    // if requested room is busy -> redirecting to '/random'
    if (rooms[room] != undefined)
        if (rooms[room].count == 2)
            return res.redirect(dir + "random");

    next(); // else if requested room is OK
}

module.exports = (app, rms) => {
    rooms = rms;

    app.get('/', (req, res) => {
        res.render("index");
    });

    app.get(dir, (req, res) => res.redirect(dir + 'random'));

    app.get(dir + ':id', roomFilter, (req, res) => {
        let room = req.params.id.toLowerCase();

        let type = req.query.t !== undefined;
        funcs.joinRoom(room, type, rooms);

        let _last = req.cookies;

        res.cookie("last", room, {maxAge: cookieExpireTime});

        res.render("game", {room:room, lastRoom: _last['last']});

    });

    // command to show rooms
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', cmd => {
        if (cmd.trim() == "rooms") console.log(rooms);
    });
}
