import { unaccentString } from './utils';

describe('unaccentString', () => {
  it('should normalize strings with no accents or special characters', () => {
    const result = unaccentString('string normal');
    expect(result).toBe('string normal');
  });

  it('should normalize strings with special characters', () => {
    const result = unaccentString('Muçum');
    expect(result).toBe('Mucum');
  });

  it('should normalize strings with accents', () => {
    const result = unaccentString('Guaporé');
    expect(result).toBe('Guapore');
  });

  it('should normalize strings with both accents and special characters', () => {
    const result = unaccentString('Muçúm');
    expect(result).toBe('Mucum');
  });
});
