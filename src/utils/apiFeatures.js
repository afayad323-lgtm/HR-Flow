class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    Object.keys(queryObj).forEach((key) => {
      if (
        queryObj[key] === undefined ||
        queryObj[key] === null ||
        queryObj[key] === ""
      ) {
        delete queryObj[key];
      }
    });

    if (Object.keys(queryObj).length > 0) {
      this.query = this.query.find(queryObj);
    }

    return this;
  }

  search() {
    if (this.queryString.search) {
      const regex = new RegExp(this.queryString.search, "i");

      this.query = this.query.find({
        reason: regex,
      });
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
