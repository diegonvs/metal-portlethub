import PortletImpl from '../impl';

class DummyActionPortlet extends PortletImpl {
  executeAction(p, e) {
    return new Promise((resolve, reject) => resolve([]));
  }
}

export default DummyActionPortlet;
