export class HttpRequest {
	private headers: Record<string, string> = {};
	private _body: Buffer | null = null;
	private method: string = '';
	private url: string = '';
	public body: any;

	public set_header = (header: string, value: string): void => {
		this.headers[header] = value.trim();
	}
	public get_header = (header: string): string => this.headers[header];
	public get_method = (): string => this.method;
	public get_url = (): string => this.url;
	public get_body = (): Buffer | null => this._body;
	public set_body = (body: string): void => {
		this._body = Buffer.from(body);
		this.body = body;
	}
	public set_method = (method: string): void => {
		this.method = method;
	}

	public set_url = (url: string): void => {
		this.url = url;
	}
}
