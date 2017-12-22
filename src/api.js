import { async } from 'metal';
import { AccessDeniedException, NotInitializedException } from './exceptions';
import { assertType } from './util';
import { isElement } from 'metal';
import { RenderData, RenderState, PortletParameters } from './data';

const RENDER_DATA = Symbol('RENDER_DATA');
const RENDER_STATE = Symbol('RENDER_STATE');

const clientEventListeners = {};
const errorListeners = {};
const portletRegex = '^portlet[.].*';
const registeredPortlets = {};
const registeredHubs = {};
const stateChangeListeners = {};
const stateListenersQueue = [];
let nextEventListenerId = 0;

class PartialActionInit {
	constructor(url = '') {
		this.url = url;
	}

	setPageState(pid, ustr) {

	}
}

let busy = false;

class PortletInit {
	constructor(impl, pid) {
		this._impl = impl;
		this._pid = pid;
	}

	hasStateChangeListener() {
		return Object.keys(stateChangeListeners).filter((key) => {
			return stateChangeListeners[key].id === this._pid;
		}).length > 0;
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

	addSystemEventListener(eventType, callback) {
		let handle;

		switch (eventType) {
			case 'portlet.onStateChange':
				handle = `system:stateChange:${nextEventListenerId++}`;
				stateChangeListeners[handle] = {
					id: this._pid,
					callback
				};
				this.updateStateForPortlet_(this._pid);
				break;

			case 'portlet.onError':
				handle = `system:error:${nextEventListenerId++}`;
				errorListeners[handle] = {
					id: this._pid,
					callback
				};
				break;

			default:
				throw new TypeError(`Invalid system event type: ${eventType}`);
		}

		return handle;
	}

	addClientEventListener(eventType, callback) {
		const handle = `client:${eventType}:${nextEventListenerId++}`;

		clientEventListeners[handle] = callback;

		return handle;
	}

	removeEventListener(handle) {
		assertType('handle', handle, 'string');
		if (arguments.length > 1) {
			throw new TypeError('too many arguments passed.');
		}
		else if (clientEventListeners.hasOwnProperty(handle)) {
			delete clientEventListeners[handle];
		}
		else if (errorListeners.hasOwnProperty(handle)) {
			delete errorListeners[handle];
		}
		else if (stateChangeListeners.hasOwnProperty(handle)) {
			delete stateChangeListeners[handle];
		}
		else {
			throw new TypeError('invalid event handle.');
		}
	}

	action(...args) {
		let params;
		let el;
		if (args.length === 2) {
			if (isElement(args[0])) {
				el = args[0];
				params = args[1];
			}
			else {
				el = args[1];
				params = args[0];
			}
		}
		else if (args.length === 1) {
			el = args[0];
		}
		else if (args.length > 2) {
			throw new TypeError('too many arguments passed.');
		}
		if (!isElement(el)) {
			throw new TypeError('element should be a HTML node.');
		}
		if (!params) {
			throw new TypeError('params should be an object.');
		}
		if (params === el) {
			throw new TypeError('element and element should not be equal.');
		}
		if (Object.keys(params).find(key => !Array.isArray(params[key]))) {
			throw new TypeError('parameter values should be an array.');
		}
		if (busy) {
			throw new AccessDeniedException('Operation in progress');
		}
		if (!this.hasStateChangeListener()) {
			throw new NotInitializedException(`No onStateChange listener registered for portlet: ${this._pid}`);
		}
		busy = true;
		return this._impl
			.executeAction(new PortletParameters(params), el)
			.then((updatedPortletIds) => {
				busy = false;
			});
	}

	createResourceUrl(parameters, cache, resid) {
		if (arguments.length > 3) {
			throw new TypeError(
				"Too many arguments. 3 arguments are allowed.");
		}
		let occurs = 0;
		for (var key in arguments) {
			if (key.match(/cache/g)){
				occurs++;
			}
		}
		if (occurs > 2){
			throw new TypeError('You cannot pass 2 cacheability arguments');
		}
		if (parameters == null) {
			return '';
		}
		if (arguments[0].match(/cache/g)){
			throw new TypeError('You cannot specify cacheability first');
		}

		return this._impl.createResourceUrl();
	}

	dispatchClientEvent(eventType, payload) {

	}

	updateStateForPortlet_(portletId) {
		const stateChangeListenerKeys = Object.keys(stateChangeListeners);
		const portletStateListeners = stateChangeListenerKeys.filter((key) => {
			const listener = stateChangeListeners[key];
			return (
				listener.id === portletId &&
				stateListenersQueue.indexOf(listener) === -1
			);
		}).forEach(key => {
			// console.log(`Updated stateListenersQueue with ${key} for portlet ${portletId}`);
			stateListenersQueue.push(stateChangeListeners[key]);
		});

		const state = this.getRenderState();
		const data = this.getRenderData();

		if (!state) {
			return;
		}

		while (stateListenersQueue.length > 0) {
			// async.nextTick(() => {
				const listener = stateListenersQueue.shift();
				const callback = listener.callback;

				if (data && data.content) {
					callback('portlet.onStateChange', state, data);
				} else {
					callback('portlet.onStateChange', state);
				}
			// });
		}
	}

	isInProgress() {}

	newParameters(parameters) {}

	newState(state) {
		return new RenderState(state);
	}

	getRenderState() {
		return this._impl[RENDER_STATE];
	}

	getRenderData() {
		return this._impl[RENDER_DATA];
	}

	setRenderData(renderData) {
		this._impl[RENDER_DATA] = renderData;
	}

	setRenderState(renderState) {
		this._impl[RENDER_STATE] = renderState;
	}

	startPartialAction(parameters) {}
}

class Portlet {
	constructor(impl) {
		this._impl = impl;
	}

	register(pid) {
		return new Promise((resolve, reject) => {
			if (!this._impl.isValidPid(pid)) {
				reject(new Error('Invalid portlet ID: ' + pid));
			}

			registeredPortlets[pid] = this._impl;

			const hub = new PortletInit(this._impl, pid);

			registeredHubs[pid] = hub;

			resolve(hub);
		});
	}

	static getPortletHub(pid) {
		return registeredHubs[pid];
	}
}

export default Portlet;
export { AccessDeniedException, Portlet, PortletInit, PartialActionInit };