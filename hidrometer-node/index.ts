import { Hidrometer } from './lib/services/Hidrometer';
import { MqttClient } from './lib/services/mqtt-client/MqttClient';
import { TOPIC_BLOCK, TOPIC_CONFIGURE, TOPIC_SEND_DETAILS } from './lib/services/mqtt-client/Topics';

let { MQTT_PORT, MQTT_HOST } = process.env;

const mqtt = new MqttClient(MQTT_HOST || '172.17.0.2', (MQTT_PORT ? +MQTT_PORT : 0) || 1883);

const hidrometer = new Hidrometer();

hidrometer.set_sync_data_handle( (message: Buffer): void => {
	console.log(`Sending message: ${message.toString()}`);
	mqtt.publish(TOPIC_SEND_DETAILS, message.toString());
});

mqtt.subscribe(TOPIC_BLOCK, (message: string) => {
	const data: string[] = JSON.parse(message.toString());
	
	const id = hidrometer.get_id();
	const should_block = data.some( data_id => id == data_id);
	if(should_block) {
		console.log("Blocking this hidrometer");
		hidrometer.pause_flow();
	}
	else {
		console.log("Releasing this hidrometer");
		hidrometer.resume_flow();
	} 
		
})

mqtt.subscribe(TOPIC_CONFIGURE, (message:string) => {
	const data: number = +message;
	console.log(`Set flow to ${data}`);
	hidrometer.set_flow(data);
})

mqtt.listen();