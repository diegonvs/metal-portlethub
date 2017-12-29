import PortletImpl from '../impl';
import {PortletConstants, RenderData, RenderState} from '../data';
import MockData from '../__mocks__/MockData';
import DummyActionPortlet from '../__mocks__/DummyActionPortlet';
import {Portlet, PortletInit} from '../api';
import {AccessDeniedException, NotInitializedException} from '../exceptions';
import Uri from 'metal-uri';
import {
  createResourceUrl,
  getInitiatingPortletId,
  isResourceUrl,
  getCacheability,
  getResourceParms,
} from '../util';

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
          const parms = 30;
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
        }).not.toThrow();
      });
    });

    it('returns a string if both arguments are valid', function() {
      const parms = {rp1: ['resVal']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.createResourceUrl(parms, 'cacheLevelFull').then(result => {
          expect(typeof result).toBe('string');
        });
      });
    });

    it('Throws an exception if cacheability is specified first', function() {
      const parms = {rp1: ['resVal']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => {
          hub.createResourceUrl('cacheLevelPage', parms);
        }).toThrowError(TypeError);
      });
    });

    it('returns a string if only cacheability present', function() {
      const parms = {rp1: ['resVal']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.createResourceUrl(null, 'cacheLevelPortlet').then(result => {
          expect(typeof result).toBe('string');
        });
      });
    });

    it('returns a string if only resource parameters present', function() {
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.createResourceUrl(parms).then(result => {
          expect(typeof result).toBe('string');
        });
      });
    });

    it('returns a string if no parameters present', function() {
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.createResourceUrl().then(result => {
          expect(typeof result).toBe('string');
        });
      });
    });

    it('returns a URL indicating the initiating portlet A', function() {
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub
          .createResourceUrl(parms, 'cacheLevelPage', portletA)
          .then(result => {
            expect(getInitiatingPortletId(result)).toEqual(portletA);
          });
      });
    });

    it('returns a URL indicating a different initiating portlet B', function() {
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub
          .createResourceUrl(parms, 'cacheLevelPage', portletA)
          .then(result => {
            expect(getInitiatingPortletId(result)).not.toEqual(portletB);
          });
      });
    });

    it('returns a resource URL', function() {
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub
          .createResourceUrl(parms, 'cacheLevelPage', portletA)
          .then(result => {
            expect(isResourceUrl(result)).toBeTruthy();
          });
      });
    });

    it('returns a URL with cacheability set to "cacheLevelPage"', function() {
      const cache = 'cacheLevelPage';
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          expect(getCacheability(result)).toEqual(cache);
        });
      });
    });

    it('returns a URL with cacheability set to "cacheLevelPortlet"', function() {
      const cache = 'cacheLevelPortlet';
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          expect(getCacheability(result)).toEqual(cache);
        });
      });
    });

    it('returns a URL with cacheability set to "cacheLevelFull"', function() {
      const cache = 'cacheLevelFull';
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          expect(getCacheability(result)).toEqual(cache);
        });
      });
    });

    it('returns a URL with the resource parameters set as expected', function() {
      const cache = 'cacheLevelFull';
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          const resultUri = new Uri(result);
          Object.keys(parms).forEach(key => {
            expect(resultUri.getParameterValues(key)).toEqual(parms[key]);
          });
        });
      });
    });

    it('returns a URL with multivalued resource parameters set as expected', function() {
      const cache = 'cacheLevelPage';
      const parms = {rp1: ['resVal', 'resVal1'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache).then(result => {
          const resultUri = new Uri(result);
          Object.keys(parms).forEach(key => {
            expect(resultUri.getParameterValues(key)).toEqual(parms[key]);
          });
        });
      });
    });

    it('returns a URL with multivalued resource parameters containing null set as expected', function() {
      const cache = 'cacheLevelPage';
      const parms = {rp1: ['resVal', undefined, 'resVal1'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          const resultUri = new Uri(result);
          Object.keys(parms).forEach(key => {
            expect(resultUri.getParameterValues(key)).toEqual(parms[key]);
          });
        });
      });
    });
  });

  describe('The portlet hub createResourceUrl function takes state into account: ', function() {
    it('returns a URL with the render state set when cacheability = cacheLevelPage', function() {
      const cache = 'cacheLevelPage';
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          expect(getCacheability(result)).toEqual(cache);
        });
      });
    });

    it('returns a URL with the render state set when cacheability = cacheLevelPortlet', function() {
      const cache = 'cacheLevelPortlet';
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          expect(getCacheability(result)).toEqual(cache);
        });
      });
    });

    it('returns a URL with no render state set when cacheability = cacheLevelFull', function() {
      const cache = 'cacheLevelFull';
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          expect(getCacheability(result)).toEqual(cache);
        });
      });
    });

    it('returns a URL containing state of different portlet when cacheability = cacheLevelPage', function() {
      const cache = 'cacheLevelPage';
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          expect(getCacheability(result)).toEqual(cache);
        });
      });
    });

    it('returns a URL not containing state of different portlet when cacheability = cacheLevelPortlet', function() {
      const cache = 'cacheLevelPortlet';
      const parms = {rp1: ['resVal'], rp2: ['resVal2']};
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        return hub.createResourceUrl(parms, cache, portletA).then(result => {
          expect(getCacheability(result)).toEqual(cache);
        });
      });
    });
  });
});
