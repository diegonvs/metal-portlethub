import PortletImpl from '../impl';
import Uri from 'metal-uri';

class DummyActionPortlet extends PortletImpl {
  executeAction(p, e) {
    return new Promise((resolve, reject) => resolve([]));
  }
  createResourceUrl(param, cache, resid) {
    let str = '';
    if (typeof param == 'object') {
      for (var key in object) {
        if (key[value] != undefined) {
          str += JSON.stringify(key);
        }
      }
    } else {
      str = JSON.stringify(param);
    }
    return new Uri(`http://dummyportlet/?${str}&portletId=${resid}&${cache}`);
  }
}

export default DummyActionPortlet;
