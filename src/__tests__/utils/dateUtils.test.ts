import { formatDateToBrazilian, formatDateToISO } from '../../utils/dateUtils';

describe('DateUtils', () => {
  describe('formatDateToBrazilian', () => {
    it('should format a Date object to Brazilian format', () => {
      const date = new Date(1990, 0, 1);
      const formattedDate = formatDateToBrazilian(date);
      expect(formattedDate).toBe('01/01/1990');
    });

    it('should format an ISO string to Brazilian format', () => {
      const isoString = '1990-01-01T03:00:00.000Z';
      const formattedDate = formatDateToBrazilian(isoString);
      expect(formattedDate).toBe('01/01/1990');
    });
  });

  describe('formatDateToISO', () => {
    it('should parse a Brazilian formatted date to a Date object', () => {
      const dateString = '01/01/1990';
      const date = formatDateToISO(dateString);
      expect(date).toEqual(new Date(1990, 0, 1));
    });

    it('should throw an error for an invalid date', () => {
      const invalidDateString = '31/02/1990';
      expect(() => formatDateToISO(invalidDateString)).toThrow('Data inválida');
    });

    it('should parse a valid date in the past', () => {
      const dateString = '29/02/2020';
      const date = formatDateToISO(dateString);
      expect(date).toEqual(new Date(2020, 1, 29));
    });

    it('should parse a valid date in the future', () => {
      const dateString = '31/12/2100';
      const date = formatDateToISO(dateString);
      expect(date).toEqual(new Date(2100, 11, 31));
    });
  });
});
