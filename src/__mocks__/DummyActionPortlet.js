import PortletImpl from '../impl';
import Uri from 'metal-uri';
import {getInitData} from '../__mocks__/MockData';

class DummyActionPortlet extends PortletImpl {
  executeAction(p, e) {
    return new Promise((resolve, reject) => resolve([]));
  }

  getUrl(type, pid, parameters, cache, resid) {
    let uri = new Uri(`http://www.liferay.com/`);

    if (pid) {
      uri.setPathname(pid);
    }

    for (let key in parameters) {
      if (parameters[key] instanceof Array) {
        Object.keys(parameters).reduce((ret, act) => {
          uri.setParameterValues(ret, parameters[ret]);
          uri.setParameterValues(act, parameters[act]);
        });
      } else {
        Object.keys(parameters).reduce((ret, act) => {
          uri.setParameterValue(ret, parameters[ret]);
          uri.setParameterValue(act, parameters[act]);
        });
      }
    }

    if (cache) {
      uri.setParameterValue('cache', cache);
    }
    if (resid) {
      uri.setParameterValue('resid', resid);
    }

    uri.setParameterValue('type', type);

    return new Promise((resolve, reject) => {
      if (uri instanceof Error) {
        reject(new Error(uri));
      }

      resolve(uri.toString());
    });
  }
}

export default DummyActionPortlet;
