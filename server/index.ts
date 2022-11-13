import { MqttClient } from './lib/services/mqtt-client/MqttClient';
import { ServerController } from './lib/controllers/ServerController';
import { TOPIC_SEND_DETAILS, TOPIC_HISTORY_REQUEST, TOPIC_TOP_FIVE_REQUEST } from './lib/services/mqtt-client/Topics';
import './config-db.ts';

// Hidrometer
const address = "mqtt://localhost";
const mqtt = new MqttClient(address, 1883);
const controller = new ServerController();
mqtt.subscribe(TOPIC_SEND_DETAILS, controller.get_hidrometer_data);
mqtt.listen()

const address2 = "mqtt://localhost";
const mqtt2 = new MqttClient(address2, 1884)
// Central Unit
mqtt2.subscribe(TOPIC_HISTORY_REQUEST, controller.history);
mqtt2.subscribe(TOPIC_TOP_FIVE_REQUEST, controller.top_five);
mqtt2.listen();