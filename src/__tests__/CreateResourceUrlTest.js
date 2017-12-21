import PortletImpl from '../impl';
import Utilities from '../__mocks__/Utilities';
import {PortletConstants, RenderData, RenderState} from '../data';
import DummyActionPortlet from '../__mocks__/DummyActionPortlet';
import {Portlet, PortletInit} from '../api';
import {AccessDeniedException, NotInitializedException} from '../exceptions';
import Uri from 'metal-uri';
import MockData from '../__mocks__/MockData';

/**
 * This is Jasmine test code for the Portlet Hub.
 * <p>
 * Since the portlet hub does not get reinitialized, its state is
 * maintained throughout the testing. The tests are constructed so that
 * by the end of module execution, any listeners that are added in the
 * earlier portions of the test are removed.
 */

describe('The portlet hub allows the portlet client to create a resource URL.', function() {
  'use strict';

  // get the portlet IDs provided by the system under test. The function must
  // return a string array of portlet IDs that are known to the portlet hub being
  // tested. Portlets:
  //                private parms        public parms             Render data
  //                =============        ============             ===========
  //    portletA      parm1, parm2             -                     -
  //    portletB      parm1, parm2       pubparm1                    -
  //    portletC      parm1, parm2       pubparm1, pubparm2          -
  //    portletD      parm2, pubparm1    pubparm2                    -
  //    portletE      parm1, parm2       pubparm1, pubparm2          -
  //    portletF           -                   -                     -
  let portletIds = MockData.test.getIds(),
    portletA = portletIds[0],
    portletB = portletIds[1],
    portletC = portletIds[2],
    portletD = portletIds[3],
    // Test data provided by the portlet hub
    pageState = MockData.test.getInitData(),
    // Tests in thismodule need following portlets. register them.
    // These variables provide linkage between the "describe" sections
    hubA,
    hubB,
    hubC,
    hubD;

  describe('The portlet hub createResourceUrl function: ', function() {
    it('is present in the register return object and is a function', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(typeof hub.createResourceUrl).toEqual('function');
      });
    });

    it('throws a TypeError if too many (>3) arguments are provided', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          hub.createResourceUrl(null, 'parm1', 'parm2', 'parm3');
        }).toThrow(TypeError);
      });
    });

    // it('throws a TypeError if a single argument is null',function(){
    //    var testFunc = function () {
    //       hubA.createResourceUrl(null);
    //    }
    //    expect(testFunc).toThrowCustomException("TypeError");
    // });

    // it('throws a TypeError if the cacheability argument is null',function(){
    //    var parms  = {rp1 : ["resVal"]};
    //    var testFunc = function () {
    //       hubA.createResourceUrl(parms, null);
    //    }
    //    expect(testFunc).toThrowCustomException("TypeError");
    // });

    // it('throws a TypeError if resource parameters  is null',function(){
    //    var testFunc = function () {
    //       hubA.createResourceUrl(null, "cacheLevelFull");
    //    }
    //    expect(testFunc).toThrowCustomException("TypeError");
    // });

    // it('throws a TypeError if resource parameters is undefined',function(){
    //    var testFunc = function () {
    //       hubA.createResourceUrl(undefined, "cacheLevelFull");
    //    }
    //    expect(testFunc).toThrowCustomException("TypeError");
    // });

    it('throws a TypeError if resource parameters is invalid', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          const parms = {rp1: ['resVal']};
          hub.createResourceUrl(parms, 'cacheLevelPortlet');
        }).toThrow(TypeError);
      });
    });

    it('throws a TypeError if the cacheability argument is invalid', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          const parms = {rp1: ['resVal']};
          hub.createResourceUrl(parms, 'Invalid');
        }).toThrow(TypeError);
      });
    });

    it('throws a TypeError if there are 2 cacheability arguments', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          hub.createResourceUrl('cacheLevelPage', 'cacheLevelFull');
        }).toThrow(TypeError);
      });
    });

    it('throws a TypeError if there are 2 res params arguments', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          const parms = {rp1: ['resVal']};
          hub.createResourceUrl(parms, parms);
        }).toThrow(TypeError);
      });
    });

    it('does not throw if both arguments are valid', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          const parms = {rp1: ['resVal']};
          hub.createResourceUrl(parms, 'cacheLevelPage');
        }).resolves.not.toThrow();
      });
    });

    it('returns a string if both arguments are valid', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          const parms = {rp1: ['resVal']};
          hub.createResourceUrl(parms, 'cacheLevelFull');
        }).resolves.toBeTruthy(typeof 'string');
      });
    });

    it('Throws an exception if cacheability is specified first', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          const parms = {rp1: ['resVal']};
          hub.createResourceUrl('cacheLevelPage', parms);
        }).toThrow(TypeError);
      });
    });

    it('returns a string if only cacheability present', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          hub.createResourceUrl(null, 'cacheLevelPortlet');
        }).resolves.toBeTruthy(typeof 'string');
      });
    });

    it('returns a string if only resource parameters present', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          const parms = {rp1: ['resVal'], rp2: ['resVal2']};
          hub.createResourceUrl(parms);
        }).resolves.toBeTruthy(typeof 'string');
      });
    });

    it('returns a string if no parameters present', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          const parms = {rp1: ['resVal'], rp2: ['resVal2']};
          hub.createResourceUrl(params);
        }).resolves.toBeTruthy(typeof 'string');
      });
    });
    // http://mock/?portletId=abc&param1=a&param2=b

    // new Uri(url).getParam('portletId').toEqial(portletA)

    it('returns a URL indicating the initiating portlet A', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl)
        .register(portletA)
        .then(hub => {
          const parms = {rp1: ['resVal'], rp2: ['resVal2']};
          hub.createResourceUrl(parms, 'cacheLevelPage');
        })
        .then(res => {
          expect(res).toEqual(portletA);
        });
    });
  });
  // http://portal.com/?ppid=_myportlet_&param1=zxssd&lifecycle=2
  // runs(function() {
  //   id = MockData.test.resource.getInitiatingPortletId(ph.result);
  //   expect(id).toEqual(portletA);
  // });

  it('returns a URL indicating a different initiating portlet B', function() {
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        const parms = {rp1: ['resVal'], rp2: ['resVal2']};
        hub.createResourceUrl(parms, ' cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.getInitiatingPortletId(result)).toEqual(portletB);
      });
  });

  it('returns a resource URL', function() {
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.isResultourceUrl(result)).toBeDefined();
      });
  });

  it('returns a URL with cacheability set to "cacheLevelPage"', function() {
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.getCacheability(result)).toEqual('cacheLevelPage');
      });
  });

  it('returns a URL with cacheability set to "cacheLevelPortlet"', function() {
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPortlet');
      })
      .then(result => {
        expect(Utilities.getCacheability(result)).toEqual('cacheLevelPortlet');
      });
  });

  it('returns a URL with cacheability set to "cacheLevelFull"', function() {
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelFull');
      })
      .then(result => {
        expect(Utilities.getCacheability(result)).toEqual('cacheLevelPortlet');
      });
  });

  it('returns a URL with the resource parameters set as expected', function() {
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    const impl = new DummyActionPortlet();
    let testFunc = function() {
      return hubB.createResourceUrl(parms, 'cacheLevelPage');
    };
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.getResourceParms(result)).toEqual(parms);
      });
  });

  it('returns a URL with multivalued resource parameters set as expected', function() {
    let parms = {rp1: ['resVal', 'resVal1'], rp2: ['resVal2']};
    const impl = new DummyActionPortlet();
    let testFunc = function() {
      return hubB.createResourceUrl(parms, cache);
    };
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.getResourceParms(result)).toEqual(parms);
      });
  });

  it('returns a URL with multivalued resource parameters containing null set as expected', function() {
    let parms = {rp1: ['resVal', null, 'resVal1'], rp2: ['resVal2']};
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.getResourceParms(result)).toEqual(parms);
      });
  });

  it('returns a URL with null resource parameter set as expected', function() {
    let parms = {rp1: ['resVal'], rp2: [null]};
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.getResourceParms(result)).toEqual(parms);
      });
  });

  it('returns a URL without resource parameters when none are added', function() {
    let parms = {};
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(null, 'cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.getResourceParms(result)).toEqual(parms);
      });
  });
});

describe('The portlet hub createResourceUrl function takes state into account: ', function() {
  // Make sure it works for more than one portlet

  let cbB = new MockData.jasmine.JasminePortletUtils(portletB, pageState);
  let cbC = new MockData.jasmine.JasminePortletUtils(portletC, pageState);
  let cbD = new MockData.jasmine.JasminePortletUtils(portletD, pageState);

  // add an osc handler for the test
  beforeEach(function() {
    cbB.complete = false;
    cbC.complete = false;
    cbD.complete = false;
    runs(function() {
      cbB.oscHandle = hubB.addEventListener(
        'MockData.onStateChange',
        cbB.getListener()
      );
      cbC.oscHandle = hubC.addEventListener(
        'MockData.onStateChange',
        cbC.getListener()
      );
      cbD.oscHandle = hubD.addEventListener(
        'MockData.onStateChange',
        cbD.getListener()
      );
    });
    waitsFor(
      cbB.getIsComplete(),
      'The onStateChange callback should be called',
      100
    );
    waitsFor(
      cbC.getIsComplete(),
      'The onStateChange callback should be called',
      100
    );
    waitsFor(
      cbD.getIsComplete(),
      'The onStateChange callback should be called',
      100
    );
    runs(function() {
      cbB.complete = false; // in prep for the actual test
      cbC.complete = false; // in prep for the actual test
      cbD.complete = false; // in prep for the actual test
    });
  });

  // remove the osc handler added during the test
  afterEach(function() {
    if (cbB.oscHandle !== null) {
      hubB.removeEventListener(cbB.oscHandle);
      cbB.oscHandle = null;
    }
    if (cbC.oscHandle !== null) {
      hubC.removeEventListener(cbC.oscHandle);
      cbC.oscHandle = null;
    }
    if (cbD.oscHandle !== null) {
      hubD.removeEventListener(cbD.oscHandle);
      cbD.oscHandle = null;
    }
  });

  it('returns a URL with the render state set when cacheability = cacheLevelPage', function() {
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    let cache = 'cacheLevelPage';
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletA)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.getState(result, portletA)).toEqual('cb'.getState()); // o que danado é cb?
      });
  });

  it('returns a URL with the render state set when cacheability = cacheLevelPortlet', function() {
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletB)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPortlet');
      })
      .then(result => {
        expect(Utilities.getState(result, portletB)).toEqual(cbB.getState());
      });
  });

  it('returns a URL with no render state set when cacheability = cacheLevelFull', function() {
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    const impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletB)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelFull');
      })
      .then(result => {
        expect(Utilities.getState(result, portletB)).toEqual({});
      });
  });

  it('returns a URL containing state of different portlet when cacheability = cacheLevelPage', function() {
    let impl = new DummyActionPortlet();
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    let testFunc = function() {
      return hubB.createResourceUrl(parms, 'cacheLevelPage');
    };
    return new Portlet(impl)
      .register(portletB)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPage');
      })
      .then(result => {
        expect(Utilities.getState(result, portletC)).toEqual(cbC.getState());
      });
  });

  it('returns a URL not containing state of different portlet when cacheability = cacheLevelPortlet', function() {
    let parms = {rp1: ['resVal'], rp2: ['resVal2']};
    let impl = new DummyActionPortlet();
    return new Portlet(impl)
      .register(portletC)
      .then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelPortlet');
      })
      .then(result => {
        expect(Utilities.getState(result, portletC)).toEqual({});
      });
  });
});
