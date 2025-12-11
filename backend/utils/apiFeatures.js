class APIFeatures {
  
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    
  }

  search() {
    let keyword = this.queryStr.name
      ? {
          name: {
            $regex: this.queryStr.name,
            $options: "i",
          },
        }
      : {};

    this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const { category } = this.queryStr;
    const { ratings } = this.queryStr;
    const { price } = this.queryStr;

    const queryRatings = {};

    if (ratings) {
      queryRatings["ratings"] = {
        ["$gte"]: Number(ratings)
      };

      this.query.find(queryRatings);
    }

    if (category) {
      let cate = category.split(",");

      let buildq = {};  
      buildq["category"] = { $in: cate };
      
      this.query.find(buildq);
      
    }

    if (price) {
      let priceRange = price.split(",");

      const queryPrice = {};

      queryPrice["price"] = {
        ["$gte"]: Number(priceRange[0]),
        ["$lte"]: Number(priceRange[1]),
      };

      this.query.find(queryPrice);
      
    }

    return this;
  }

  sort() {
    const { ordeyByPrice } = this.queryStr;
    const { ordeyByName } = this.queryStr;
    const order = {
      price: ordeyByPrice == "asc" ? 1 : ordeyByPrice == "desc" ? -1 : 1,
    };
    const orderName = {
      name: ordeyByName == "asc" ? 1 : ordeyByName == "desc" ? -1 : 1,
    };
    if (ordeyByPrice) {
      this.query.find({}).sort(order);

      return this;
    }
    if (ordeyByName) {
      this.query.find({}).sort(orderName);

      return this;
    }
    return this;
  }
  paginate() {
    const currentPage = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 8;
    const skip = limit * (currentPage - 1);
    this.query.limit(limit).skip(skip);
    return this;
  }
}
module.exports = APIFeatures;
