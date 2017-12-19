import PortletImpl from '../impl';
import {PortletConstants, RenderData, RenderState} from '../data';
import MockData from '../__mocks__/MockData';
import DummyActionPortlet from '../__mocks__/DummyActionPortlet';
import {Portlet, PortletInit} from '../api';
import {AccessDeniedException, NotInitializedException} from '../exceptions';

/**
 * This is Jasmine test code for the Portlet Hub.
 * <p>
 * Since the portlet hub does not get reinitialized, its state is
 * maintained throughout the testing. The tests are constructed so that
 * by the end of module execution, any listeners that are added in the
 * earlier portions of the test are removed.
 */

describe('The portlet hub provides the ability to add and remove event listeners.', function() {
  // get the portlet IDs provided by the system under test. The function must
  // return a string array of portlet IDs that are known to the portlet hub being
  // tested. There must be at least 3 IDs available. The first portlet (portletA)
  // has some parameters set and no render data. The 2nd portlet (portletC)
  // has no parameters set, and no render data. The final test portlet
  // (portletB) has both parameters and render data.
  let portletIds = MockData.test.getIds(),
    pageState = MockData.test.getInitData(),
    portletA = portletIds[0],
    portletDataA = pageState[portletA],
    portletB = portletIds[3],
    portletC = portletIds[1];

  // All tests need a registered portlet client. For the mockup, assume portlet ID portletA
  // is present. Get the hub functions for the portlet.
  // These variables provide linkage between the "describe" sections
  
  const userEventName = 'someEvent';

  describe('The portlet hub addEventListener function: ', function() {
    it('is present in the register return object and is a function', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(typeof hub.addEventListener).toEqual('function');
      });
    });

    it('throws a TypeError if no argument is provided', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => hub.addEventListener()).toThrowError(TypeError);
      });
    });

    it('throws a TypeError if 1 argument is provided', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => hub.addEventListener(userEventName)).toThrowError(
          TypeError
        );
      });
    });

    it('throws a TypeError if too many (>2) arguments are provided', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() =>
          hub.addEventListener('parm1', 'parm2', 'parm3')
        ).toThrowError(TypeError);
      });
    });

    it('throws a TypeError if the type argument is not a string', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => hub.addEventListener(89, () => {})).toThrowError(
          TypeError
        );
      });
    });

    it('throws a TypeError if the function argument is not a function', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => hub.addEventListener(userEventName, 89)).toThrowError(
          TypeError
        );
      });
    });

    it('throws a TypeError if the type is null', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => hub.addEventListener(null, () => {})).toThrowError(
          TypeError
        );
      });
    });

    it('throws a TypeError if the function is null', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => hub.addEventListener(userEventName, null)).toThrowError(
          TypeError
        );
      });
    });

    it('throws a TypeError if the type begins with "portlet." but is neither "portlet.onStateChange" or "portlet.onError"', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() =>
          hub.addEventListener('portlet.invalidType', () => {})
        ).toThrowError(TypeError);
      });
    });

    it('does not throw an exception if both parameters are valid', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() =>
          hub.addEventListener(userEventName, () => {})
        ).not.toThrow();
      });
    });

    it('returns a handle to the event handler (an object) when the parameters are valid', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const eventHandle = hub.addEventListener(userEventName, () => {});
        expect(typeof eventHandle).not.toEqual('undefined');
      });
    });

    it('allows a listener for event type "portlet.onStateChange" to be added.', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const eventHandle = hub.addEventListener(
          'portlet.onStateChange',
          () => {}
        );
        expect(typeof eventHandle).not.toEqual('undefined');
      });
    });

    it('allows a listener for event type "portlet.onError" to be added.', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const eventHandle = hub.addEventListener('portlet.onError', () => {});
        expect(typeof eventHandle).not.toEqual('undefined');
      });
    });
  });

  describe('The portlet hub removeEventListener function: ', function() {
    it('is present in the register return object and is a function', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(typeof hub.removeEventListener).toEqual('function');
      });
    });

    it('throws a TypeError if no argument is provided', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => hub.removeEventListener()).toThrow(TypeError);
      });
    });

    it('throws a TypeError if too many (>1) arguments are provided', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() =>
          hub.removeEventListener('parm1', 'parm2', 'parm3')
        ).toThrow(TypeError);
      });
    });

    it('throws a TypeError if the handle is null', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => hub.removeEventListener(null)).toThrow(TypeError);
      });
    });

    it('throws a TypeError if the handle is undefined', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() => hub.removeEventListener(undefined)).toThrow(TypeError);
      });
    });

    it('throws a TypeError if the handle has an invalid value', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        expect(() =>
          hub.removeEventListener('This is an invalid handle.')
        ).toThrow(TypeError);
      });
    });

    it('allows a previously added user event listener to be removed', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const handle = hub.addEventListener('userEvent', () => {});
        expect(() => hub.removeEventListener(handle)).not.toThrow();
      });
    });

    it('allows a previously added portlet.onStateChange event listener to be removed', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const handle = hub.addEventListener('portlet.onStateChange', () => {});
        expect(() => hub.removeEventListener(handle)).not.toThrow();
      });
    });

    it('allows a previously added portlet.onError event listener to be removed', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const handle = hub.addEventListener('portlet.onError', () => {});
        expect(() => hub.removeEventListener(handle)).not.toThrow();
      });
    });

    it('throws a TypeError if the user event handler is removed twice', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const handle = hub.addEventListener('userEvent', () => {});
        expect(() => hub.removeEventListener(handle)).not.toThrow();
        expect(() => hub.removeEventListener(handle)).toThrow(TypeError);
      });
    });

    it('throws a TypeError if the onStateChange event handler is removed twice', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const handle = hub.addEventListener('portlet.onStateChange', () => {});
        expect(() => hub.removeEventListener(handle)).not.toThrow();
        expect(() => hub.removeEventListener(handle)).toThrow(TypeError);
      });
    });

    it('throws a TypeError if the onError event handler is removed twice', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const handle = hub.addEventListener('portlet.onError', () => {});
        expect(() => hub.removeEventListener(handle)).not.toThrow();
        expect(() => hub.removeEventListener(handle)).toThrow(TypeError);
      });
    });
  });

  describe('Without render data, the portlet client onStateChange function: ', function() {
    it('does not call the portlet.onStateChange listener during the addEventListener call', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const callback = jest.fn();
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).not.toBeCalled();
      });
    });

    it('is called asynchronously after an onStateChange handler is registered', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.setRenderState(
          new RenderState({
            param1: 'value1',
          })
        );
        const callback = jest.fn();
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toBeCalled();
      });
    });

    it('is passed a type parameter with value "portlet.onStateChange"', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const params = {param1: 'value1'};
        hub.setRenderState(
          new RenderState({
            parameters: params,
          })
        );
        const callback = jest.fn();
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toBeCalledWith(
          'portlet.onStateChange',
          expect.objectContaining({
            parameters: params,
            portletMode: PortletConstants.VIEW,
            windowState: PortletConstants.NORMAL,
          })
        );
      });
    });

    it('its RenderState "windowState" property is a string', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const callback = jest.fn((eventType, renderState) => {
          expect(typeof renderState.windowState).toBe('string');
        });
        hub.setRenderState(new RenderState());
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toHaveBeenCalled();
      });
    });

    it('its RenderState "portletMode" property is a string', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const callback = jest.fn((eventType, renderState) => {
          expect(typeof renderState.portletMode).toBe('string');
        });
        hub.setRenderState(new RenderState());
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toHaveBeenCalled();
      });
    });

    it(
      'its RenderState has windowState=' + portletDataA.state.windowState,
      function() {
        const impl = new DummyActionPortlet();
        return new Portlet(impl).register(portletA).then(hub => {
          const callback = jest.fn((eventType, renderState) => {
            expect(renderState.windowState).toBe(
              portletDataA.state.windowState
            );
          });
          hub.setRenderState(new RenderState(portletDataA.state));
          hub.addEventListener('portlet.onStateChange', callback);
          expect(callback).toHaveBeenCalled();
        });
      }
    );

    it(
      'its RenderState has portletMode=' + portletDataA.state.portletMode,
      function() {
        const impl = new DummyActionPortlet();
        return new Portlet(impl).register(portletA).then(hub => {
          const callback = jest.fn((eventType, renderState) => {
            expect(renderState.portletMode).toBe(
              portletDataA.state.portletMode
            );
          });
          hub.setRenderState(new RenderState(portletDataA.state));
          hub.addEventListener('portlet.onStateChange', callback);
          expect(callback).toHaveBeenCalled();
        });
      }
    );

    it('its RenderState parameter is not identical to the test state object"', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        const callback = jest.fn((eventType, renderState) => {
          expect(renderState).not.toBe(portletDataA.state);
        });
        hub.setRenderState(new RenderState(portletDataA.state));
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toHaveBeenCalled();
      });
    });

    it('its RenderState parameter equals the test state object"', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.setRenderState(new RenderState(portletDataA.state));
        hub.setRenderData(
          new RenderData(
            portletDataA.renderData.content,
            portletDataA.renderData.mimeType
          )
        );
        const callback = jest.fn((eventType, renderState) => {
          let testState = hub.newState(portletDataA.state);
          expect(renderState).toEqual(testState);
        });
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  describe('With render data, the portlet client onStateChange function: ', function() {
    it('is passed a RenderData object with a "content" property', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.setRenderState(new RenderState(portletDataA.state));
        hub.setRenderData(
          new RenderData(
            portletDataA.renderData.content,
            portletDataA.renderData.mimeType
          )
        );
        const callback = jest.fn((eventType, renderState, renderData) => {
          expect(typeof renderData.content).not.toEqual('undefined');
        });
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toHaveBeenCalled();
      });
    });

    it('is passed a RenderData object with a "mimeType" property', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.setRenderState(new RenderState(portletDataA.state));
        hub.setRenderData(
          new RenderData(
            portletDataA.renderData.content,
            portletDataA.renderData.mimeType
          )
        );
        const callback = jest.fn((eventType, renderState, renderData) => {
          expect(typeof renderData.mimeType).not.toEqual('undefined');
        });
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toHaveBeenCalled();
      });
    });

    it('is passed a RenderData object with a "content" property of type string', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.setRenderState(new RenderState(portletDataA.state));
        hub.setRenderData(
          new RenderData(
            portletDataA.renderData.content,
            portletDataA.renderData.mimeType
          )
        );
        const callback = jest.fn((eventType, renderState, renderData) => {
          expect(typeof renderData.content).toEqual('string');
        });
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toHaveBeenCalled();
      });
    });

    it('is passed a RenderData object with a "mimeType" property of type string', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.setRenderData(
          new RenderData(
            portletDataA.renderData.content,
            portletDataA.renderData.mimeType
          )
        );
        hub.setRenderState(new RenderState(portletDataA.state));
        const callback = jest.fn((eventType, renderState, renderData) => {
          expect(typeof renderData.mimeType).toEqual('string');
        });
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toHaveBeenCalled();
      });
    });

    it('its RenderData parameter equals the test render data object"', function() {
      const impl = new DummyActionPortlet();
      return new Portlet(impl).register(portletA).then(hub => {
        hub.setRenderData(
          new RenderData(
            portletDataA.renderData.content,
            portletDataA.renderData.mimeType
          )
        );
        hub.setRenderState(new RenderState(portletDataA.state));
        const callback = jest.fn((eventType, renderState, renderData) => {
          expect(renderData).toEqual(portletDataA.renderData);
        });
        hub.addEventListener('portlet.onStateChange', callback);
        expect(callback).toHaveBeenCalled();
      });
    });
  });
});
