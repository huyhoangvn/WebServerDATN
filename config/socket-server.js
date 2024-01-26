const io = require('socket.io')();  // chú ý có ()  ở cuối

const socket = {
    io: io
}

// code tương tác gì đó thì sẽ viết ở đây

io.on("connection", (client) => {
    console.log("Client connected : " + client.id);
    // định nghĩa 1 sự kiện
    client.on('new msg', (data) => {
        // nhận dữ liệu từ client gửi lên
        console.log("New msg: " + data);
        // gửi phản hồi
        client.emit('new msg', "Server da nhan roi nhe: " + data);
    });


    // sự kiện ngắt kết nối

    client.on('disconnect', () => {
        console.log("Client disconected!");
    })


});

// cuối cùng thì phải export
module.exports = socket;