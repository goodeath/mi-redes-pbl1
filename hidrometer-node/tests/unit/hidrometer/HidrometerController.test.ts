import { Hidrometer } from '../../../lib/services/Hidrometer';
import { HidrometerController } from '../../../lib/controllers/HidrometerController';

describe("Hidrometer Controller", () => {
	it('Details', async () => {
		jest.useFakeTimers();
		const hidrometer = new Hidrometer();
		const controller = new HidrometerController(hidrometer);
		let id = hidrometer.get_id();
		let consumption = hidrometer.get_consumption();
		let flow_rate = hidrometer.get_flow_rate();
		let data = await controller.details({}, {});

		expect(data).toEqual({
			consumption,
			flow_rate,
			id
		});

		jest.runOnlyPendingTimers();

		consumption += flow_rate;
		data = await controller.details({}, {});

		expect(data).toEqual({
			consumption,
			flow_rate,
			id
		});

		hidrometer.pause_flow();
		jest.useRealTimers();
	});


	it('Pause flow', async () => {
		jest.useFakeTimers();
		const hidrometer = new Hidrometer();
		const controller = new HidrometerController(hidrometer);
		jest.runOnlyPendingTimers();
		jest.runOnlyPendingTimers();
		const data = await controller.details({}, {});
		await controller.pause_flow({}, {});
		jest.runOnlyPendingTimers();
		expect(hidrometer.get_consumption()).toEqual(data.consumption);
		jest.useRealTimers();
	});


	it('Resume flow', async () => {
		jest.useFakeTimers();

		const hidrometer = new Hidrometer();
		const controller = new HidrometerController(hidrometer);

		jest.runOnlyPendingTimers();
		jest.runOnlyPendingTimers();

		const data = await controller.details({}, {});

		await controller.pause_flow({}, {});
		jest.runOnlyPendingTimers();

		expect(hidrometer.get_consumption()).toEqual(data.consumption);

		await controller.resume_flow({}, {});
		jest.runOnlyPendingTimers();
		expect(hidrometer.get_consumption()).toEqual(data.consumption + data.flow_rate);
		jest.useRealTimers();
	});

});
