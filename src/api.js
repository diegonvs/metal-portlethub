import { assertType } from './util';
import { isElement } from 'metal';
import { AccessDeniedException, NotInitializedException } from './exceptions';
import { RenderState, PortletParameters } from './data';

class PartialActionInit {
	constructor(url = '') {
		this.url = url;
	}

	setPageState(pid, ustr) {}
}

let busy = false;

class PortletInit {
	constructor(impl, pid) {
		this._impl = impl;
		this._pid = pid;
	}

	addEventListener(eventType, handler) {
		return this._impl.addEventListener(eventType, handler);
	}

	removeEventListener(handle) {
		return this._impl.removeEventListener(handle);
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
			throw new TypeError('too many paremeters passed.');
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
		if (!this.hasStateChangeListener_()) {
			throw new NotInitializedException(`No onStateChange listener registered for portlet: ${this._pid}`);
		}
		busy = true;
		return this._impl
			.executeAction(new PortletParameters(params), el)
			.then((updatedPortletIds) => {
				busy = false;
			});
	}

	hasStateChangeListener_() {
		return this._impl.hasStateChangeListener();
	}

	createResourceUrl(parameters, cache, resid) {}

	dispatchClientEvent(eventType, payload) {}

	isInProgress() {}

	newParameters(parameters) {}

	newState(state) {
		return new RenderState(state);
	}

	setRenderState(renderState) {}

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

			resolve(new PortletInit(this._impl, pid));
		});
	}
}

export default Portlet;
export { AccessDeniedException, Portlet, PortletInit, PartialActionInit };