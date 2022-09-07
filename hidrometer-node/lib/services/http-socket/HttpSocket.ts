import { HttpRequest } from './HttpRequest';
export class HttpSocket {

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
