const MSG_MEMORY_LEAK = `You've called the destroyer of an event listener that was already destroyed, this may indicate a memory leak`;

/**
 * A function that will stop this instance of listening to the event.
 */
export type SimpleEventUnlistener<P = void> = () => P;

/**
 * The function called when this event is emitted as you listen to it.
 */
export type SimpleEventCallback<Args extends unknown[] = never[]> = (
	...args: Args
) => void | Promise<void>;

/**
 * A simple event class, representing one event.
 *
 * Unlike a lot of event code, `emit` is async, allowing you to `await` all handling of the event.
 */
export class SimpleEvent<EventParams extends unknown[] = []> {
	private readonly callbacks: SimpleEventCallback<EventParams>[] = [];

	/**
	 * Returns true if there is at least one listener for this event.
	 */
	public get hasListeners(): boolean {
		return this.callbacks.length > 0;
	}

	/**
	 * Wait for this event to trigger and run the callback every time it does.
	 *
	 * Returns a function with which the event listener is removed again.
	 */
	public on(callback: SimpleEventCallback<EventParams>): SimpleEventUnlistener {
		const cancel = (): void => {
			const index = this.callbacks.indexOf(callback);
			if (index === -1) {
				throw new Error(MSG_MEMORY_LEAK);
			}
			this.callbacks.splice(index, 1);
		};
		this.callbacks.push(callback);
		return cancel;
	}

	/**
	 * Trigger all callbacks that were waiting for this event.
	 */
	public async emit(...args: EventParams): Promise<void> {
		// Create a new array from callbacks so that the loop is not affected
		// while once-ers change the true callbacks list by reference:
		const callbacks = this.callbacks.slice();

		for (const callback of callbacks) {
			await callback(...args);
		}
	}

	/**
	 * Remove all listeners to this event.
	 */
	public clear(): void {
		this.callbacks.splice(0, this.callbacks.length);
	}
}
