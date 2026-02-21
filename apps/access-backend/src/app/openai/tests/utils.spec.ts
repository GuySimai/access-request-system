import { getAccessRequestUserPrompt, isValidAiRecommendation } from '../utils';
import { EmployeeMetadata } from '@prisma/client';

describe('OpenAI Utils', () => {
  describe('getAccessRequestUserPrompt', () => {
    it('should format prompt without metadata', () => {
      const result = getAccessRequestUserPrompt(
        'req@monday.com',
        'sub@monday.com',
        'res',
        'reason'
      );
      expect(result).toContain('req@monday.com');
      expect(result).toContain('sub@monday.com');
      expect(result).toContain('res');
      expect(result).toContain('reason');
    });

    it('should format prompt with metadata', () => {
      const mockMetadata: EmployeeMetadata = {
        id: '1',
        employeeId: 'e1',
        department: 'Engineering',
        jobTitle: 'Dev',
        tenureMonths: 12,
        updatedAt: new Date(),
      };
      const result = getAccessRequestUserPrompt(
        'req@monday.com',
        'sub@monday.com',
        'res',
        'reason',
        mockMetadata,
        mockMetadata
      );
      expect(result).toContain('Dept: Engineering');
      expect(result).toContain('Title: Dev');
      expect(result).toContain('Tenure: 12 months');
    });
  });

  describe('isValidAiRecommendation', () => {
    it('should return true for valid object', () => {
      const valid = {
        recommendation: 'APPROVE',
        reasoning: 'ok',
        confidenceScore: 0.9,
      };
      expect(isValidAiRecommendation(valid)).toBe(true);
    });

    it('should return false for invalid object', () => {
      expect(isValidAiRecommendation({})).toBe(false);
      expect(isValidAiRecommendation({ recommendation: 'INVALID' })).toBe(
        false
      );
      expect(isValidAiRecommendation(null)).toBe(false);
    });
  });
});
