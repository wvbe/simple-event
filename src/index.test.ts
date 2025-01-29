/* global jest, describe, it, expect */

import { SimpleEvent } from '.';

describe('Event', () => {
	it('.on()', async () => {
		const event = new SimpleEvent();
		const listener = jest.fn();

		event.on(listener);
		expect(listener).toHaveBeenCalledTimes(0);
		await event.emit();
		expect(listener).toHaveBeenCalledTimes(1);
		await event.emit();
		expect(listener).toHaveBeenCalledTimes(2);
	});

	it('.on() destroyer', () => {
		// eslint-disable-next-line no-console, no-undef
		console.warn = jest.fn();
		const event = new SimpleEvent();
		const listener = jest.fn();
		const destroyer = event.on(listener);

		expect(event.hasListeners).toBeTruthy();
		void event.emit();
		expect(listener).toHaveBeenCalledTimes(1);

		destroyer();

		expect(event.hasListeners).toBeFalsy();
		void event.emit();
		expect(listener).toHaveBeenCalledTimes(1);

		expect(() => {
			destroyer();
		}).toThrow(/memory leak/iu);
	});

	it('.clear()', () => {
		const event = new SimpleEvent();
		const listener = jest.fn();
		const destroyer = event.on(listener);

		expect(event.hasListeners).toBeTruthy();
		void event.emit();
		expect(listener).toHaveBeenCalledTimes(1);

		event.clear();

		expect(event.hasListeners).toBeFalsy();
		void event.emit();
		expect(listener).toHaveBeenCalledTimes(1);

		expect(() => {
			destroyer();
		}).toThrow(/memory leak/iu);
	});
});
