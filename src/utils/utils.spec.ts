import { Test, TestingModule } from '@nestjs/testing';
import { slugify } from './utils';

describe('slugify function', () => {

    it('should handle accented characters', () => {
      const result = slugify('tést');
      expect(result).toBe('test');
    });

    it('should handle uppercase characters', () => {
      const result = slugify('Test');
      expect(result).toBe('test');
    });

    it('should handle double spaces', () => {
      const result = slugify('test  test');
      expect(result).toBe('test-test');
    });
});
