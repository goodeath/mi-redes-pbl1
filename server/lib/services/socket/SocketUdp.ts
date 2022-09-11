import * as udp from 'dgram';

export class SocketUdp {	
	private socket: udp.Socket | undefined;
	public listen(port: number, callback: Function){
		this.socket = udp.createSocket('udp4');
		this.socket.on('error', (err:Error) => {
			console.log("An error happened", err);
		});
		this.socket.on('message', (buffer: Buffer, rinfo: udp.RemoteInfo) => {
  	  		//console.log('Data received from client : ' + buffer.toString());
  	  		//console.log('Received %d bytes from %s:%d\n',buffer.length, rinfo.address, rinfo.port);
  	  		callback(buffer.toString());
		});

		this.socket.on('listening', () => {
			console.log("UDP Server is running");
		});

		this.socket.bind(port);
	}
}
