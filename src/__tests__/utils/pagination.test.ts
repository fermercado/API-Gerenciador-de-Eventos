import { PaginationService } from '../../utils/pagination';

describe('PaginationService', () => {
  let paginationService: PaginationService;

  beforeEach(() => {
    paginationService = new PaginationService();
  });

  describe('paginate', () => {
    it('should paginate query correctly with given page and limit', () => {
      const query = { key: 'value' };
      const page = 2;
      const limit = 10;

      const result = paginationService.paginate(query, page, limit);

      expect(result).toEqual({
        ...query,
        skip: 10,
        limit: 10,
      });
    });

    it('should paginate query correctly with page 1 and given limit', () => {
      const query = { key: 'value' };
      const page = 1;
      const limit = 20;

      const result = paginationService.paginate(query, page, limit);

      expect(result).toEqual({
        ...query,
        skip: 0,
        limit: 20,
      });
    });

    it('should paginate query correctly with page 3 and limit 5', () => {
      const query = { key: 'value' };
      const page = 3;
      const limit = 5;

      const result = paginationService.paginate(query, page, limit);

      expect(result).toEqual({
        ...query,
        skip: 10,
        limit: 5,
      });
    });

    it('should paginate query correctly with page 0 (edge case)', () => {
      const query = { key: 'value' };
      const page = 0;
      const limit = 10;

      const result = paginationService.paginate(query, page, limit);

      expect(result).toEqual({
        ...query,
        skip: -10,
        limit: 10,
      });
    });

    it('should paginate query correctly with negative page (edge case)', () => {
      const query = { key: 'value' };
      const page = -1;
      const limit = 10;

      const result = paginationService.paginate(query, page, limit);

      expect(result).toEqual({
        ...query,
        skip: -20,
        limit: 10,
      });
    });
  });
});
