import { assertType } from './util';

class PortletImpl {
	constructor() {
		this.nextEventListenerId = 0;
		this.stateChangeListeners = {};
		this.errorListeners = {};
		this.clientEventListeners = {};
	}

	addEventListener(eventType, handler) {
		assertType('eventType', eventType, 'string');
		assertType('handler', handler, 'function');

		if (eventType.startsWith('portlet.')) {
			return this.addSystemEventListener(eventType, handler);
		} else {
			return this.addClientEventListener(eventType, handler);
		}
	}

	addSystemEventListener(eventType, listener) {
		let handle;

		switch (eventType) {
			case 'portlet.onStateChange':
				handle = `system:stateChange:${this.nextEventListenerId++}`;
				this.stateChangeListeners[handle] = listener;
				break;

			case 'portlet.onError':
				handle = `system:error:${this.nextEventListenerId++}`;
				this.errorListeners[handle] = listener;
				break;

			default:
				throw new TypeError(`Invalid system event type: ${eventType}`);
		}

		return handle;
	}

	addClientEventListener(eventType, listener) {
		const handle = `client:${eventType}:${this.nextEventListenerId++}`;

		this.clientEventListeners[handle] = listener;

		return handle;
	}

	hasStateChangeListener() {
		return Object.keys(this.stateChangeListeners).length > 0;
	}

	createUrl() {
		
	}

	executeAction() {
		throw new TypeError('Method not implemented');
	}

	removeEventListener(handle) {
		delete this.clientEventListeners[handle];
	}

	isValidPid(pid) {
		// TODO
		return true;
	}
}

export default PortletImpl;