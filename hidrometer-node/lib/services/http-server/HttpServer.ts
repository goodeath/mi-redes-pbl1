import * as http from 'http';

import { RouteNotFoundException } from "../../exceptions";
import { REQUEST_METHOD } from "./enums/RequestMethod";

type RouteList = Record<REQUEST_METHOD, Record<string, Function>>;

export class HttpServer {
	private server: http.Server | null = null;

	private routes: RouteList  = {
		[REQUEST_METHOD.GET]: {},
		[REQUEST_METHOD.PUT]: {},
		[REQUEST_METHOD.POST]: {}
	};


	public listen(port: number){
		this.server = http.createServer( async (req,res) => {
			const method = <REQUEST_METHOD>req.method?.toLowerCase();
			let chunks:any[] = [];
			let data;
			req.on("data", (chunk) => {
				chunks.push(chunk);
			});
			req.on("end", async () => {
				data = Buffer.concat(chunks);
				data = JSON.parse(data.toString());
				req = <any>{
					...req,
					body: data
				}
				if(!method || !req.url) {
					res.end('');
					return ;
				}
				let response = await this.request(method , req.url, req, res);
				if(typeof response == 'object') response = JSON.stringify(response);
				res.statusCode = 200
				res.setHeader('Content-Type', 'text/plain')
		    	res.end(response)
			});
		});

		this.server.listen(port, (): void => {
    		console.log(`HTTP Server started at port ${port}`);
		});
	}

	private set_route(method: REQUEST_METHOD, route: string, fn: Function): void {
		this.routes[method][route] = fn;
	}

	public get(route: string, fn: Function): void {
		this.set_route(REQUEST_METHOD.GET, route, fn);
	}

	public put(route: string, fn: Function): void {
		this.set_route(REQUEST_METHOD.PUT, route, fn);
	}

	public post(route: string, fn: Function): void {
		this.set_route(REQUEST_METHOD.POST, route, fn);
	}

	public async request(method: REQUEST_METHOD, route: string, req:any, res: any): Promise<any | RouteNotFoundException> {
		if(this.routes[method][route])
			return await this.routes[method][route](req, res);
		return Promise.reject(new RouteNotFoundException(method, route));
	}
}
