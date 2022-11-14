import { MqttClient } from './lib/services/mqtt-client/MqttClient';
import { ServerController } from './lib/controllers/ServerController';
import { 
    TOPIC_SEND_DETAILS, 
    TOPIC_HISTORY_REQUEST, 
    TOPIC_TOP_FIVE_REQUEST, 
    TOPIC_HISTORY, 
    TOPIC_TOP_FIVE, 
    TOPIC_BLOCK_REQUEST, 
    TOPIC_BLOCK, 
    TOPIC_FOG_MEAN, 
    TOPIC_FOG_MEAN_REQUEST 
} from './lib/services/mqtt-client/Topics';
import './config-db.ts';

// Hidrometer
const address = "172.17.0.2";
const mqtt = new MqttClient(address, 1883);
const controller = new ServerController();
mqtt.subscribe(TOPIC_SEND_DETAILS, controller.get_hidrometer_data);
mqtt.listen()

const address2 = "172.17.0.3";
const mqtt2 = new MqttClient(address2, 1883)
// Central Unit
mqtt2.subscribe(TOPIC_HISTORY_REQUEST, controller.history, TOPIC_HISTORY);
mqtt2.subscribe(TOPIC_TOP_FIVE_REQUEST, controller.top_five, TOPIC_TOP_FIVE);
mqtt2.subscribe(TOPIC_FOG_MEAN_REQUEST, controller.send_mean, TOPIC_FOG_MEAN);
mqtt2.subscribe(TOPIC_BLOCK_REQUEST, controller.block, TOPIC_BLOCK, mqtt);

mqtt2.listen();