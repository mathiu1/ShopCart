import React, { useEffect } from "react";
import BannerCarousel from "../components/BannerCarousel";
import MetaData from "../components/MetaData";
import { getAllProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Products from "../components/products/Products";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search";
import HorizontalSlider from "../components/HorizontalSlider"; 
const Home = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const { products, loading, error } = useSelector(
    (state) => state.productsState
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }
    dispatch(getAllProducts());
  }, [error, dispatch]);

  const slides = [
    "https://t3.ftcdn.net/jpg/04/65/46/52/360_F_465465254_1pN9MGrA831idD6zIBL7q8rnZZpUCQTy.jpg",
    "https://static.vecteezy.com/ti/gratis-vektor/p1/11871820-online-shopping-am-telefon-kaufen-verkaufen-geschaft-digitale-web-banner-anwendung-geldwerbung-zahlung-e-commerce-illustration-suche-vektor.jpg",
    "https://us.123rf.com/450wm/vectorlab/vectorlab1901/vectorlab190100066/123179129-flash-sale-hot-advertising-horizontal-poster-business-ecommerce-discount-promotion-gradient.jpg?ver=6",
    "https://static.vecteezy.com/system/resources/thumbnails/004/707/493/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    "https://img.freepik.com/free-vector/shopping-time-banner-with-realistic-map-cart-gift-bags-vector-illustration_548887-120.jpg",
  ];

  // Group products by category
  const groupedProducts = products?.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="my-5 max-w-7xl mx-auto px-3">
          <MetaData title={"Buy Best Products"} />

          {/* Search */}
          <div className="mb-6">
            <Search />
          </div>

          {/* Banner */}
          <BannerCarousel slides={slides} />

          {/* Category-wise Products */}
          {groupedProducts &&
            Object.keys(groupedProducts).map((category, idx) => (
              <div key={idx} className="mt-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-800">
                    {category}
                  </h2>
                  <button
                    onClick={() =>
                      navigator(`/products/all`)
                    }
                    className="text-sm md:text-base text-yellow-500 hover:text-yellow-600 font-medium transition-colors"
                  >
                    View All →
                  </button>
                </div>

                
                <HorizontalSlider
                  items={groupedProducts[category].slice(0, 6)}
                  sliderId={`slider-${category}`}
                  renderItem={(product) => <Products product={product} />}
                />
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Home;
