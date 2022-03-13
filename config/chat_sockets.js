module.exports.chatSockets = (socketServer) => {
    const {Server} = require("socket.io");
    const io = new Server(socketServer, {
        cors: {
            origin: "http://localhost:8000",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New connection received", socket.id)

        socket.on("disconnecting", () => {
            console.log(socket.rooms); // the Set contains at least the socket ID
        });

        socket.on("disconnect", () => {
            console.log("connection disconnected");
        })

        socket.on("join_room", (data) => {
            console.log("joining request rec", data);
            socket.join(data.chatroom);
            io.to(data.chatroom).emit('user_joined', data);
        });

        socket.on("send_message", (data) => {
            io.in(data.chatroom).emit("receive_message", data);
        })
    })
}