import {PortletParameters} from './data';

export function assertType(name, actual, expected) {
	if (!Array.isArray(expected)) {
		expected = [expected];
	}

	for (let type of expected) {
		switch (type) {
			case null:
				if (actual == null) return;
				break;

			case Array:
				if (Array.isArray(actual)) return;
				break;

			case PortletParameters:
				if (actual instanceof PortletParameters) return;
				break;

			case 'object':
				if (!Array.isArray(actual) && typeof actual === 'object')
					return;
				break;

			default:
				if (typeof actual === type) return;
				break;
		}
	}

	throw new TypeError(
		`Invalid type for argument '${name}': ${typeof actual}`,
	);
}
