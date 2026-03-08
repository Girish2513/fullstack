export function paginate(data: any[], page: number, limit: number) {
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: data.slice(start, end),
    page,
    limit,
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
  };
}
