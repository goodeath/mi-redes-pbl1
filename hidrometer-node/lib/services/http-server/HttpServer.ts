import { RouteNotFoundException } from "../../exceptions";
import { REQUEST_METHOD } from "./enums/RequestMethod";
import { HttpSocket, HttpRequest, HttpResponse } from '../http-socket/';

type RouteList = Record<REQUEST_METHOD, Record<string, Function>>;

export class HttpServer {
	private server: HttpSocket | null = null;

	private routes: RouteList  = {
		[REQUEST_METHOD.GET]: {},
		[REQUEST_METHOD.PUT]: {},
		[REQUEST_METHOD.POST]: {}
	};


	public listen(port: number){
		this.server = new HttpSocket();
		this.server.create_server(port, async (request: HttpRequest, response: HttpResponse) => {
			const method = <REQUEST_METHOD>request.get_method().toLowerCase();
			const url = request.get_url();
			let route_response = await this.request(method , url, request, response);
			if(typeof route_response == 'object') route_response = JSON.stringify(route_response);
			response.add_header('Content-Type', 'text/json');
			response.end(route_response);
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

	public request = async (method: REQUEST_METHOD, route: string, req:any, res: any): Promise<any | RouteNotFoundException> =>  {
		if(this.routes[method][route])
			return await this.routes[method][route](req, res);
		return Promise.reject(new RouteNotFoundException(method, route));
	}
}
