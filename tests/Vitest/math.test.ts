import { describe, it, expect } from 'vitest';
import { add, subtract } from '@/utils/math';

describe('Math utilities', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should subtract two numbers correctly', () => {
    expect(subtract(5, 2)).toBe(3);
  });
});
