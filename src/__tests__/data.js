import {PortletParameters} from '../data';

describe('PortletParameters', () => {
  it('stores parameters values', () => {
    let params = new PortletParameters();

    params['x'] = 'y';

    expect(params['x']).toEqual('y');
    expect(params['y']).toBeUndefined();
  });

  it('clone() works', () => {
    let params = new PortletParameters();
    params['x'] = 'y';
    params['y'] = 'z';
    params = params.clone();

    expect(params['x']).toEqual('y');
    expect(params['y']).toEqual('z');
    expect(params['z']).toBeUndefined();
  });

  it('clone() does not maintain references to original parameters', () => {
    let srcParams = new PortletParameters();
    srcParams['x'] = ['y', 'z'];
    srcParams['y'] = 'z';
    let params = srcParams.clone();

    srcParams['x'].push('a');
    srcParams['y'] = 'a';
    srcParams['z'] = 'a';

    expect(params['x']).toEqual(['y', 'z']);
    expect(params['y']).toEqual('z');
    expect(params['z']).toBeUndefined();
  });
});

describe('RenderState', () => {});
