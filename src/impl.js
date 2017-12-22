import Uri from 'metal-uri';
import { assertType } from './util';

class PortletImpl {
	constructor(portletId) {

	}

	createUrl() {
		throw new TypeError('Method createUrl not implemented');
	}

	createResourceUrl (resParams, cache, resid) {
		var ii, arg, cacheability = null,
			pi, rid = null;

		if (resParams) {
			if (typeof resParams === 'object') {
				validateParms(resParams); // throws
				// if
				// parms
				// are
				// invalid
			} else {
				throw new TypeError(
					"Invalid argument type. Resource parameters must be a parameters object.");
			}
		}

		if (cache) {
			if (typeof cache === 'string') {
				switch (cache) {
					case "cacheLevelPage":
					case "cacheLevelPortlet":
					case "cacheLevelFull":
						cacheability = cache;
						break;
					default:
						throw new TypeError(
							"Invalid cacheability argument: " +
							cache);
				}
			} else {
				throw new TypeError(
					"Invalid argument type. Cacheability argument must be a string.");
			}
		}

		// fallback to page level cacheability
		if (!cacheability) {
			cacheability = "cacheLevelPage";
		}

		if (resid) {
			if (typeof resid === 'string') {
				rid = resid;
			} else {
				throw new TypeError(
					"Invalid argument type. Resource ID argument must be a string.");
			}
		}

		// everything ok, so get URL from the impl
		pi = _registeredPortlets[portletId];
		return pi.getUrl("RESOURCE", resParams,
			cacheability, rid);
	},

	createResourceUrl(param, cache, resid) {
		let str = '';
		if (typeof param == 'object') {
			for (let key in object) {
			if (key[value] != undefined) {
				str += JSON.stringify(key);
			}
			}
		} else {
			str = JSON.stringify(param);
		}
		const uri = new Uri(
			`http://dummyportlet/?${str}&portletId=${resid}&${cache}`
		);
		return uri.toString();
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