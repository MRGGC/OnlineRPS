const funcs = require('./../funcs');

module.exports = (io, socket, rooms) => {

    socket.on('disconnecting', room => rooms[room].count--);

    socket.on('joinRoom', (room, lastRoom) => funcs.joinSocket(io, socket, room, lastRoom, rooms));

    socket.on('makingMove', (move, room) => socket.broadcast.to(room).emit('opponentMove', move));

    socket.on('sendPoints', (room, p1, p2) => socket.broadcast.to(room).emit('initializePoints', p1, p2));

}
