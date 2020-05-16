const Paginate = (page, limit, blogs) => {
  const NumOfPages = Math.ceil(blogs.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return { blogs: blogs.slice(startIndex, endIndex), NumOfPages };
};

module.exports = Paginate;
