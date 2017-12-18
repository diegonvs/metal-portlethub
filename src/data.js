import { assertType } from './util';

export const PortletConstants = {
	EDIT: 'edit',
	FULL: 'cacheLevelFull',
	HELP: 'help',
	MAXIMIZED: 'maximized',
	MINIMIZED: 'minimized',
	NORMAL: 'normal',
	PAGE: 'cacheLevelPage',
	PORTLET: 'cacheLevelPortlet',
	VIEW: 'view',
};

export class PortletParameters {
	constructor(parameters = {}) {
		for (let prop in parameters) {
			if (
				parameters.hasOwnProperty(prop) &&
				Array.isArray(parameters[prop])
			) {
				this[prop] = parameters[prop].slice(0);
			} else {
				this[prop] = parameters[prop];
			}
		}
	}

	clone() {
		return new PortletParameters(this);
	}
}

export class RenderState {
	constructor(
		{
			parameters = new PortletParameters(),
			portletMode = PortletConstants.VIEW,
			windowState = PortletConstants.NORMAL,
		} = {},
	) {
		this.parameters = new PortletParameters(parameters);
		this.portletMode = portletMode;
		this.windowState = windowState;
	}

	clone() {
		return new RenderState(this);
	}

	setPortletMode(portletMode) {
		assertType('portletMode', portletMode, 'string');

		this.portletMode = portletMode;
	}

	getPortletMode() {
		return this.portletMode;
	}

	setWindowState(windowState) {
		assertType('windowState', windowState, 'string');

		this.windowState = windowState;
	}

	getWindowState() {
		return this.windowState;
	}

	setValue(name, value) {
		assertType('name', name, 'string');
		assertType('value', value, ['string', null, Array]);

		if (!Array.isArray(value)) {
			value = [value];
		}

		this.parameters[name] = value;
	}

	setValues(name, values) {
		this.setValue(name, values);
	}

	getValue(name, defaultValue) {
		assertType('name', name, 'string');

		const res = this.parameters[name];

		if (res === undefined) {
			return defaultValue;
		} else {
			return res[0];
		}
	}

	getValues(name, defaultValue) {
		assertType('name', name, 'string');

		const res = this.parameters[name];

		if (res === undefined) {
			return defaultValue;
		} else {
			return res;
		}
	}

	remove(name) {
		assertType('name', name, 'string');

		if (this.parameters[name] !== undefined) {
			delete this.parameters[name];
		}
	}
}

export class RenderData {
	constructor(content = '', mimeType = '') {
		this.content = content;
		this.mimeType = mimeType;
	}
}

export class ErrorData {
	constructor(name = '', message = '') {
		this.name = name;
		this.message = message;
	}
}
