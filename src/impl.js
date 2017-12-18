import { assertType } from './util';

class PortletImpl {
	constructor(portletId) {
		
	}

	createUrl() {
		throw new TypeError('Method createUrl not implemented');
	}

	executeAction() {
		throw new TypeError('Method executeAction not implemented');
	}

	getRenderData() {
		throw new TypeError('Method getRenderData not implemented');
	}

	getRenderState() {
		throw new TypeError('Method getRenderState not implemented');
	}

	isValidPid(pid) {
		// TODO
		return true;
	}
}

export default PortletImpl;