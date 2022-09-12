import * as udp from 'dgram';
import { UdpOptions } from './UdpOptions';

export class UdpClient {
	private client: udp.Socket | undefined;

	public send(message:Buffer, options: UdpOptions, callback?: Function) {
		this.client = udp.createSocket('udp4');
		this.client.send(message, options.port, options.host, (error: Error | null, bytes:number) => {
			if(this.client) this.client.close();
			if(callback) callback(error);
		});
	}
}


