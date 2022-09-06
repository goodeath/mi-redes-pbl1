import { HttpServer } from '../../../lib/services/http-server/HttpServer';
import { REQUEST_METHOD } from '../../../lib/services/http-server/enums/RequestMethod';
import { RouteNotFoundException } from '../../../lib/exceptions/';

describe('HTTP Server', () => {
	it('GET route', async () => {
		const fn = jest.fn().mockReturnValueOnce('result');
		const http = new HttpServer();
		http.get('/home', fn);
		expect(http.request(REQUEST_METHOD.GET, '/home', {}, {})).resolves.toBe('result');
	});

	it('PUT route', async () => {
		const fn = jest.fn().mockReturnValueOnce('result');
		const http = new HttpServer();
		http.put('/home', fn);
		expect(http.request(REQUEST_METHOD.PUT, '/home', {}, {})).resolves.toBe('result');
	});

	it('POST route', async () => {
		const fn = jest.fn().mockReturnValueOnce('result');
		const http = new HttpServer();
		http.post('/home', fn);
		expect(http.request(REQUEST_METHOD.POST, '/home', {}, {})).resolves.toBe('result');
	});

	it('Different methods', async () => {
		const http = new HttpServer();
		const fn = jest.fn();
		http.get('/consumption', fn);
		expect(
			http.request(REQUEST_METHOD.POST, '/consumption', {}, {})
		).rejects
		.toThrow(
			new RouteNotFoundException(REQUEST_METHOD.POST, `/consumption`)
		); 
	});


});
