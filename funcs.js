module.exports = {
    random: function(min, max) {
        return Math.floor(Math.random() * (max-min)) + min;
    },

    generateString: function(length) {
        let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let str = "";

        for (let i = 0; i < length; i++) str += chars[this.random(0, chars.length)];

        return str;
    },

    generateRoomName: function() {

        /* -xxxx-yyyy- : xxxx and yyyy are bars with same length and are connected with '-' */

        let connectChar = "–";
        let name = connectChar;
        let barLength = 22;
        let barsCount = 2;

        for (let i = 0; i < barsCount; i++)
            name += this.generateString(barLength) + connectChar;

        return name;
    },

    getFreeRoom: function(rooms) { // name of free random room, if not exists return -1
        for (i in rooms)
            if (rooms[i].count < 2 && rooms[i].type)
                return i;

        return -1;
    },

    joinRoom: function(room, type, rooms) {
        if (rooms[room] == undefined) {
            rooms[room] = {count: 1, type: type};
        } else {
            rooms[room].count++;
        }
    },

    getCookie: function(cookies, name) {
        cookies = cookies.split('; ');

        for (let cookie of cookies) {
            let values = cookie.split('=');

            if (values[0] == name) return values[1];
        }

        return -1;
    },

    joinSocket: function(io, socket, room, lastRoom, rooms) {
        socket.join(room);

        // initializing points
        if (rooms[room].count == 0 || lastRoom != room) {
            io.sockets.in(room).emit('initializePoints', 0, 0);
        } else {
            socket.broadcast.to(room).emit('getPoints');
        }
    }
}
