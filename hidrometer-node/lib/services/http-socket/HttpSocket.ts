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

			data = Buffer.concat(chunks);
			data = data.toString();
			const request = this.parse_request(data);
			if(request.body)
				request.body = JSON.parse(request.body);
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
		const pieces = request.split('\n');
		let body_found = false;
		let body = "";
		const http_request = new HttpRequest();
		const [method, url, version] = pieces[0].split(' ');
		http_request.set_method(method);
		http_request.set_url(url);
		pieces.forEach(line => {
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
