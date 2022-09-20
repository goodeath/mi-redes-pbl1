import * as net from 'net';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export class HttpSocket {
	private server: net.Server | null = null;

	public create_server = (port:number , callback: Function): void => {
		this.server = net.createServer(async (socket: net.Socket) => {
			let chunks: Buffer[] = []
			let data;
			let receiving = true;
  		  	socket.on('data', (chunk: Buffer) => {
  		  		receiving = true;
  		  		chunks.push(chunk);
			});

			socket.on('end', async () => {
			});
			while(receiving){
				receiving = false;
				await new Promise((r,j) => setTimeout(r,250));
			}
			// Request without any data, just ignore.
			if(!chunks.length) return;
			data = Buffer.concat(chunks);
			data = data.toString();
			console.log(data);
			const request = this.parse_request(data);
			if(request.body)
				request.body = JSON.parse(request.body);
			//console.log(request.body);
			const http_response = new HttpResponse();
			await callback(request, http_response);
			
			socket.write(http_response.get_response());
			socket.pipe(socket);
		});
		this.server.on('error', (err) => {
  		  console.log(err);
		});
		this.server.listen(port, () => {
  		  console.log(`Server started at ${port}`);
		});
	}

	public parse_request = (request: string): HttpRequest => {
		const dividers = ['\r\n','\r','\n'];
		let pieces: string[] = [];
		dividers.forEach( divider => {
			if(!pieces.length && request.indexOf(divider) != -1)
				pieces = request.split(divider);
		})
		let body_found = false;
		let body = "";
		const http_request = new HttpRequest();
		const [method, url, version] = pieces[0].split(' ');
		const base_url = url.split('?')[0];
		const params = Object.fromEntries(url.split('?')[1]?.split("&").map( (pair) => pair.split('=')) || []);
		http_request.set_method(method);
		http_request.set_url(base_url);
		http_request.set_params(params);
		pieces.forEach((line: string) => {
			if(body_found) body += line;
			if(this.is_header(line)){
				const [k,v] = line.split(":");
				http_request.set_header(k,v);
			} else if(!line) {
				body_found = true;
			}
		});
		http_request.set_body(body);
		return http_request;
	};

	private is_header = (data: string): boolean => {
		return data.split(":").length > 1;
	}
}
