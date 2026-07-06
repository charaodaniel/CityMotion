import { FastifyInstance } from 'fastify';
import { Server as SocketIOServer } from 'socket.io';

let _io: SocketIOServer | null = null;

/**
 * Inicializa WebSocket (Socket.IO) junto com o servidor HTTP do Fastify
 */
export function setupWebSocket(fastify: FastifyInstance) {
  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: (process.env.CORS_ORIGIN || 'http://localhost:9002').split(',').map(o => o.trim()),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('\x1b[35m[Socket]:\x1b[0m Nova conexão:', socket.id);

    socket.on('join-sector', (sector: string) => {
      socket.join(sector);
      console.log(`[Socket]: Cliente entrou no canal: ${sector}`);
    });

    // Relay de indicador de digitação
    socket.on('typing', (data: { from: string; to: string }) => {
      socket.broadcast.emit('typing', data);
    });

    socket.on('stop-typing', (data: { from: string; to: string }) => {
      socket.broadcast.emit('stop-typing', data);
    });

    socket.on('disconnect', () => {
      console.log('[Socket]: Conexão encerrada.');
    });
  });

  _io = io;
  return io;
}

export function getIO(): SocketIOServer | null {
  return _io;
}
