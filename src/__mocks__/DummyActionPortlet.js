import PortletImpl from '../impl';
import Uri from 'metal-uri';
import Utilities from '../__mocks__/Utilities';

class DummyActionPortlet extends PortletImpl {
  executeAction(p, e) {
    return new Promise((resolve, reject) => resolve([]));
  }
}

export default DummyActionPortlet;
