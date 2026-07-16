import { Server as SocketIOServer } from "socket.io";
let _io = null;
function setupWebSocket(fastify) {
  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: (process.env.CORS_ORIGIN || "http://localhost:9002").split(",").map((o) => o.trim()),
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  io.on("connection", (socket) => {
    console.log("\x1B[35m[Socket]:\x1B[0m Nova conex\xE3o:", socket.id);
    socket.on("join-sector", (sector) => {
      socket.join(sector);
      console.log(`[Socket]: Cliente entrou no canal: ${sector}`);
    });
    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", data);
    });
    socket.on("stop-typing", (data) => {
      socket.broadcast.emit("stop-typing", data);
    });
    socket.on("disconnect", () => {
      console.log("[Socket]: Conex\xE3o encerrada.");
    });
  });
  _io = io;
  return io;
}
function getIO() {
  return _io;
}
export {
  getIO,
  setupWebSocket
};
