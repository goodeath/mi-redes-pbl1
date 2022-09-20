
const { SERVER_HOST, SERVER_PORT } = process.env;

export const CONFIG = {
	HOST: SERVER_HOST != undefined ? SERVER_HOST : 'localhost',
	PORT: SERVER_PORT != undefined ? +SERVER_PORT : 9092
};
