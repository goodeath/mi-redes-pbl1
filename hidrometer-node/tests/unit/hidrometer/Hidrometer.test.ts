import { Hidrometer } from '../../../lib/services/Hidrometer';

describe('Hidrometer class', () => {
	it('Constructor', () => {
		const hidrometer = new Hidrometer();
		expect(hidrometer instanceof Hidrometer).toBe(true);
	});

	it('Get generated ID', () => {
		const hidrometers = [new Hidrometer(), new Hidrometer()];
		expect(hidrometers[0].get_id()).not.toBeFalsy();
		expect(hidrometers[1].get_id()).not.toBeFalsy();
		expect(hidrometers[0].get_id() != hidrometers[1].get_id()).toBe(true);
	});

	it('Consumption', () => {
		jest.useFakeTimers();
		const hidrometer = new Hidrometer();
		const flow_rate = hidrometer.get_flow_rate();
		expect(hidrometer.get_consumption()).toBe(0);
		jest.runOnlyPendingTimers();
		expect(hidrometer.get_consumption()).toBe(flow_rate);
		jest.runOnlyPendingTimers();
		expect(hidrometer.get_consumption()).toBe(2*flow_rate);
		hidrometer.pause_flow();
		jest.runOnlyPendingTimers();
		expect(hidrometer.get_consumption()).toBe(2*flow_rate);
		hidrometer.resume_flow();
		jest.runOnlyPendingTimers();
		expect(hidrometer.get_consumption()).toBe(3*flow_rate);
	});


	it('Changing Flow', () => {
		jest.useFakeTimers();

		const hidrometer = new Hidrometer();
		let flow_rate = hidrometer.get_flow_rate();
		let consumption = 0;

		expect(hidrometer.get_consumption()).toBe(0);
		jest.runOnlyPendingTimers();
		consumption += flow_rate;

		expect(hidrometer.get_consumption()).toBe(consumption);
		hidrometer.set_flow(flow_rate*3);
		expect(hidrometer.get_flow_rate()).toBe(flow_rate*3);
		flow_rate = hidrometer.get_flow_rate();
		jest.runOnlyPendingTimers();
		consumption += flow_rate;

		expect(hidrometer.get_consumption()).toBe(consumption);
		hidrometer.set_flow(0);
		jest.runOnlyPendingTimers();

		expect(hidrometer.get_consumption()).toBe(consumption);
	});

});
