export class RemotePlayers {
  private socket: WebSocket;
  private callbacks: { [event: string]: Function[] } = {};

  constructor(url: string) {
    this.socket = new WebSocket('ws://websocket_server:4000');

    this.socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Supondo que data contenha algo tipo:
      // { type: 'playerPosition', playerId: 'abc', position: {x, y, z} }
      if (data.type === 'playerPosition') {
        this.emit('remotePositionUpdate', data.playerId, data.position);
      }
      // pode tratar outras mensagens aqui
    };
  }

  sendPlayerPosition(position: any) {
    const message = {
      type: 'playerPosition',
      position
      // pode enviar também playerId se quiser, se seu servidor precisar
    };
    this.socket.send(JSON.stringify(message));
  }

  onRemotePositionUpdate(callback: (playerId: string, position: any) => void) {
    this.on('remotePositionUpdate', callback);
  }

  // Métodos genéricos para gerenciar callbacks de eventos
  private on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  private emit(event: string, ...args: any[]) {
    const cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach(cb => cb(...args));
    }
  }

  disconnect() {
    this.socket.close();
  }
}
