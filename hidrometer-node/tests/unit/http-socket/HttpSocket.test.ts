import { HttpSocket, HttpRequest} from '../../../lib/services/http-socket/';

describe('Socket Test', () => {
	it('Get method', () => {
		const body = `GET /details HTTP/1.1\n` +
		`Host: localhost:8124\n` + 
		`User-Agent: curl/7.68.0\n` +
		`Accept: */*\n\n`
		const socket = new HttpSocket();
		const request = socket.parse_request(body);
		expect(request.get_method()).toBe('GET');
	});


	it('Get url', () => {
		const body = `POST /configure-flow HTTP/1.1\n` +
			`Host: localhost:8124\n` +
			`User-Agent: curl/7.68.0\n` +
			`Accept: */*\n` +
			`Content-Type: json\n` +
			`Content-Length: 13\n\n` +
			`{"flow":"15"}`;
		const socket = new HttpSocket();
		const request = socket.parse_request(body);
		expect(request.get_url()).toBe('/configure-flow');
	});


	it('Get body', () => {
		const body = `POST /configure-flow HTTP/1.1\n` +
			`Host: localhost:8124\n` +
			`User-Agent: curl/7.68.0\n` +
			`Accept: */*\n` +
			`Content-Type: json\n` +
			`Content-Length: 13\n\n` +
			`{"flow":"15"}`;
		const socket = new HttpSocket();
		const request = socket.parse_request(body);
		expect(request.get_body()).toEqual(Buffer.from('{"flow":"15"}'));
	});


	it('Get headers', () => {
		const body = `POST /configure-flow HTTP/1.1\n` +
			`Host: localhost:8124\n` +
			`User-Agent: curl/7.68.0\n` +
			`Accept: */*\n` +
			`Content-Type: json\n` +
			`Content-Length: 13\n\n` +
			`{"flow":"15"}`;
		const socket = new HttpSocket();
		const request = socket.parse_request(body);
		expect(request.get_header('Accept')).toEqual('*/*');
	});
});
//server bound
//client connected
//POST /configure-flow HTTP/1.1
//Host: localhost:8124
//User-Agent: curl/7.68.0
//Accept: */*
//Content-Length: 13
//Content-Type: application/x-www-form-urlencoded

//{"flow":"15"}
//client disconnected
//client connected
//GET /details HTTP/1.1
//Host: localhost:8124
//User-Agent: curl/7.68.0
//Accept: */*


//client disconnected
//client connected
//POST /configure-flow HTTP/1.1
//Host: localhost:8124
//User-Agent: curl/7.68.0
//Accept: */*
//Content-Type: json
//Content-Length: 13
//
//{"flow":"15"}
//client disconnected
//*/
//
/*
GET / HTTP/1.1
Host: localhost:8124
Connection: keep-alive
Cache-Control: max-age=0
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
Upgrade-Insecure-Requests: 1
*/
//User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36
//Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
/*
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7
Cookie: _ga=GA1.1.1743643048.1658341634; __utmz=111872281.1658341645.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmc=111872281; _gcl_au=1.1.1858232205.1662160019; csrftoken=WGPNUTNn029MCESGOjqsXwXC8A2jQBgtWqCwMJxIBsiCpdkFQQLhN3ATIPi43dmk; cosession=u3ynbxhj8qmn4deyc28b1zbnxs4z1u0c; _ga_WYDSPEGHZY=GS1.1.1662382018.19.0.1662382026.0.0.0; jwt_api=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZXhAb25saW5lY2xpbmljLmNvbS5iciIsInVzZXJfaWQiOjI5NSwiZW1haWwiOiJhbGV4QG9ubGluZWNsaW5pYy5jb20uYnIiLCJleHAiOjE2NjI0Njg0MjZ9.i6dQT2NCr0wHNVNAaGzKCtqI-4gyz8narWS-oxHgC4w; __utma=111872281.1743643048.1658341634.1662394689.1662398144.30
*/
