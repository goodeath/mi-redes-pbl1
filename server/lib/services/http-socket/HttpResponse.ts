export class HttpResponse {
	private status_code: number = 200;
	private headers: Record<string, string> = {};
	private body: string = '';

	public get_code = (): number => this.status_code;
	public set_status_code = (code:number): HttpResponse => {
		this.status_code = code;
		return this;
	}

	public add_header = (header: string, value: string): HttpResponse => {
		this.headers[header] = value.trim();
		return this;
	}
	public get_header = (header: string): string => this.headers[header];


	public end = (body: string): HttpResponse => {
		if(body)
			this.body = body;
		return this;
	}


	public get_response = (): string => {
		let response = `HTTP/1.1 ${this.status_code} OK\n`
		response += `Server: Apache\nConnection: Close\n`;
		response += `Content-Length: ${this.body.length}\n`;
		for(const header in this.headers) 
			response += `${header}: ${this.headers[header]}\n`;
		response += `\n${this.body}`;
		return response;
	}
}
