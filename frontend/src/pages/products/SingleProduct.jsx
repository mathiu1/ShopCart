import Stars from "../../components/Stars";

import { IoHeart } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { createReview, getProduct } from "../../actions/productActions";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { useEffect, useState, useRef } from "react";
import MetaData from "../../components/MetaData";
import { addCartItem } from "../../actions/cartActions";
import ReviewModal from "../../components/ReviewModal";
import toast from "react-hot-toast";
import { clearError, createReviewSubmitted } from "../../slices/productSlice";
import { formatPriceINR } from "../../components/utils/formatPriceINR";
import { formatDistanceToNow } from "date-fns";
import Products from "../../components/products/Products";
import HorizontalSlider from"../../components/HorizontalSlider"


const SingleProduct = () => {
  const { id } = useParams();
  let {
    loading,
    product = {},
    isReviewSubmitted,
    error,
    relatedProducts = [],
  } = useSelector((state) => state.productState);

  const { user } = useSelector((state) => state.authState);

  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, show: false });

  // Mobile pinch zoom state
  const [scale, setScale] = useState(1);
  const [lastDist, setLastDist] = useState(null);

  const imgRef = useRef(null);
  

  const dispatch = useDispatch();

  const increaseQty = () => {
    if (product.stock === 0 || quantity >= product.stock) return;
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity === 1) return;
    setQuantity(quantity - 1);
  };

  useEffect(() => {
    if (isReviewSubmitted) {
      toast.success("Review Submitted Successfully");
      dispatch(createReviewSubmitted());
      dispatch(getProduct(id));
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
      return;
    }
  }, [isReviewSubmitted, error]);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [id]);

  // set main image default
  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0].image);
    }
  }, [product]);

  

  const handleSubmit = (data) => {
    const formData = new FormData();
    formData.append("rating", data.rating);
    formData.append("comment", data.comment);
    formData.append("productId", id);
    dispatch(createReview(formData));
  };

  // lens magnifier (desktop hover)
  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensSize = 100;
    const lensX = Math.max(
      lensSize / 2,
      Math.min(x, rect.width - lensSize / 2)
    );
    const lensY = Math.max(
      lensSize / 2,
      Math.min(y, rect.height - lensSize / 2)
    );

    setLensPos({ x: lensX, y: lensY, show: true });
  };

  // mobile pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      setLastDist(dist);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      if (lastDist) {
        const newScale = scale * (dist / lastDist);
        setScale(Math.min(Math.max(newScale, 1), 3)); // limit zoom 1x - 3x
      }
      setLastDist(dist);
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setLastDist(null);
  };

  const getDistance = (touches) => {
    const [t1, t2] = touches;
    return Math.sqrt(
      Math.pow(t2.clientX - t1.clientX, 2) +
        Math.pow(t2.clientY - t1.clientY, 2)
    );
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto">
          <MetaData title={product.name} />
          <div className="max-w-5xl mx-auto p-4 mt-10 md:mt-25">
            <div className="flex flex-wrap gap-x-6 items-center">
              {/* images part */}
              <div className="flex flex-1 min-w-xs justify-around p-5 gap-3">
                {/* sub images */}
                <div
                  className="flex flex-col gap-2 
                                min-w-[60px] md:min-w-[80px] overflow-y-auto max-h-60 md:max-h-100"
                >
                  {product.images &&
                    product.images.map((image) => (
                      <img
                        src={image.image}
                        alt={product.name}
                        key={image._id}
                        onClick={() => setMainImage(image.image)}
                        onMouseEnter={() => setMainImage(image.image)}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-md 
                                   border object-contain cursor-pointer flex-shrink-0
                          ${
                            mainImage === image.image
                              ? "border-yellow-500"
                              : "border-gray-300"
                          }`}
                      />
                    ))}
                </div>

                {/* main image with lens zoom (desktop) + pinch zoom (mobile) */}
                <div
                  className="relative my-auto flex justify-center items-center overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setLensPos({ ...lensPos, show: false })}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {mainImage && (
                    <img
                      ref={imgRef}
                      src={mainImage}
                      alt={product.name}
                      className="object-contain mx-auto w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-lg"
                      style={{
                        transform: `scale(${scale})`,
                        transition: "transform 0.1s ease-out",
                      }}
                    />
                  )}

                  {/* lens (desktop only) */}
                  {lensPos.show && mainImage && (
                    <div
                      className="absolute border-2 border-yellow-400 rounded-full pointer-events-none"
                      style={{
                        width: "120px",
                        height: "120px",
                        top: lensPos.y - 60,
                        left: lensPos.x - 60,
                        background: `url(${mainImage}) no-repeat`,
                        backgroundSize: `${imgRef.current.width * 2}px ${
                          imgRef.current.height * 2
                        }px`,
                        backgroundPosition: `-${lensPos.x * 2 - 60}px -${
                          lensPos.y * 2 - 60
                        }px`,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* content part */}
              <div className="flex-1 min-w-xs px-1">
                <h1 className=" font-semibold text-xl">{product.name}</h1>
                <div className="mt-2 ">
                  <Stars count={product.ratings} />
                </div>
                <p className="mt-4 ">{product.description}</p>
                <h2 className="mt-5 text-md text-gray-400 line-through">
                  {formatPriceINR(
                    (product.price + Math.random() * 500).toFixed(2)
                  )}
                </h2>
                <h1 className="text-2xl font-medium">
                  {formatPriceINR(product.price)}
                </h1>
                <div className="flex gap-3 text-lg mt-5">
                  <button
                    onClick={decreaseQty}
                    type="button"
                    className="bg-slate-200 size-8 rounded text-center"
                  >
                    -
                  </button>
                  <p>{quantity}</p>
                  <button
                    onClick={increaseQty}
                    type="button"
                    className="bg-slate-200 size-8 rounded"
                  >
                    +
                  </button>
                </div>
                <div className="mt-8">
                  <p className="font-medium text-slate-600">Status:</p>
                  {product.stock > 0 ? (
                    <span className="text-xl font-medium text-green-500">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xl font-medium text-red-500">
                      Out Of Stock
                    </span>
                  )}
                </div>
                <div className="flex flex-col-reverse md:flex-row flex-wrap-reverse gap-4 mt-6">
                  <button
                    disabled={product.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(addCartItem(product._id, quantity));
                    }}
                    className={`py-2 flex-1 rounded-lg text-sm font-medium transition-all ${
                      product.stock === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm"
                    }`}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  {user ? (
                    <div
                      onClick={() => setModalOpen(true)}
                      className="bg-slate-200 p-2 rounded-lg flex flex-1 justify-center items-center gap-1 cursor-pointer"
                    >
                      <IoHeart className="text-slate-800 " />
                      <button type="button"> Write a Review</button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

           {relatedProducts.length > 0 ? (
  <div className="mt-15">
    <h1 className="text-xl font-medium">Related Products</h1>
    <div className="my-6 border-t border-slate-300" />

    <HorizontalSlider
      items={relatedProducts}
      sliderId="related-slider"
      renderItem={(product) => <Products product={product} />}
    />
  </div>
) : null}

            {/* Review part */}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="mt-12">
                <h1 className="md:text-lg font-medium border-b border-slate-300 pb-3 mb-6">
                  Customer Reviews ({product.reviews.length})
                </h1>

                <div className="flex flex-col gap-3">
                  {product.reviews.map((review, i) => (
                    <div
                      key={i}
                      className="p-5 bg-white/90 border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {review.user?.avatar ? (
                            <img
                              src={review.user?.avatar}
                              alt={review.user?.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                            />
                          ) : (
                            <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-r from-slate-200 to-slate-300 rounded-full font-semibold text-gray-700 shadow-inner">
                              {String(review.user?.name)
                                .slice(0, 1)
                                .toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-sm capitalize text-gray-900">
                              {review?.user?.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {review?.updatedAt &&
                              review?.updatedAt !== review?.createdAt ? (
                                <>
                                  Edited{" "}
                                  {formatDistanceToNow(
                                    new Date(review?.updatedAt),
                                    {
                                      addSuffix: true,
                                    }
                                  ).replace("about ", "")}
                                </>
                              ) : (
                                formatDistanceToNow(
                                  new Date(review?.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                ).replace("about ", "")
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center">
                          <Stars count={review.rating} />
                        </div>
                      </div>

                      {/* Review Comment */}
                      <blockquote className="mt-3 pl-4 border-l-4 border-indigo-500 italic text-gray-700 text-sm leading-relaxed">
                        “{review.comment}”
                      </blockquote>
                    </div>
                  ))}
                </div>
              </div>
            ) : user ? ( //  If no reviews but user logged in
              <p className="mt-12 text-gray-500 italic">
                No reviews yet. Be the first to write one!
              </p>
            ) : (
              //  If no reviews & user not logged in
              <p className="mt-12 text-red-500 italic">
                Please login to create a review.
              </p>
            )}

            {/* Review Modal */}
            <ReviewModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
