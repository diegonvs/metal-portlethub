import {assertType} from '../util';

describe('assertType()', () => {
  it('works for object', () => {
    assertType('name', {}, 'object');
  });

  it('works for string', () => {
    assertType('name', 'a', 'string');
  });

  it('works for boolean', () => {
    assertType('name', true, 'boolean');
  });

  it('works for number', () => {
    assertType('name', 3, 'number');
  });

  it('works for Array', () => {
    assertType('name', [1, 2, 3], Array);
  });

  it('works for null', () => {
    assertType('name', null, null);
  });

  it('throws for invalid object', () => {
    expect(() => {
      assertType('name', [], 'object');
    }).toThrow(TypeError);
  });

  it('throws for invalid string', () => {
    expect(() => {
      assertType('name', {}, 'string');
    }).toThrow(TypeError);
  });

  it('throws for invalid boolean', () => {
    expect(() => {
      assertType('name', {}, 'boolean');
    }).toThrow(TypeError);
  });

  it('throws for invalid number', () => {
    expect(() => {
      assertType('name', {}, 'number');
    }).toThrow(TypeError);
  });

  it('throws for invalid Array', () => {
    expect(() => {
      assertType('name', {}, Array);
    }).toThrow(TypeError);
  });

  it('throws for invalid null', () => {
    expect(() => {
      assertType('name', {}, null);
    }).toThrow(TypeError);
  });
});
