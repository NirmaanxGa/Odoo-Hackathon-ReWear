// Pagination utility functions

const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

const getPaginationData = (totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
    hasNextPage,
    hasPrevPage
  };
};

const applySorting = (query, sortBy) => {
  const sortOptions = {
    'newest': { createdAt: -1 },
    'oldest': { createdAt: 1 },
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    'title': { title: 1 },
    'status': { status: 1 },
    'date': { createdAt: -1 }
  };
  
  const sortOption = sortOptions[sortBy] || sortOptions['newest'];
  return query.sort(sortOption);
};

module.exports = {
  getPaginationParams,
  getPaginationData,
  applySorting
};
