export class PaginationService {
  paginate(query: any, page: number, limit: number) {
    const offset = (page - 1) * limit;
    return {
      ...query,
      skip: offset,
      limit,
    };
  }
}
