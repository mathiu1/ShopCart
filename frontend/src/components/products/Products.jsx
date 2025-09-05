import Stars from "../Stars";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "../../actions/cartActions";
import { formatPriceINR } from "../../components/utils/formatPriceINR"


const Products = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {loading}=useSelector(state=>state.cartState)

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md 
                 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
     
      <div className="relative w-full h-30 flex items-center justify-center bg-gray-50">
        <img
          src={product.images[0]?.image}
          alt={product.name}
          className="object-contain h-full p-4 transition-transform duration-300 hover:scale-105"
        />
      </div>

      
      <div className="p-3 flex flex-col">
       
        <h1 className="font-semibold text-sm text-gray-800 line-clamp-1">
          {product.name}
        </h1>

        
        <div className="my-1">
          <Stars count={product.ratings} size="text-xs" />
        </div>

       
        <p className="line-clamp-2 text-xs text-gray-600 leading-4">
          {product.description}
        </p>

       
        <div className="mt-2">
          <p className="text-xs line-through text-gray-400">
            {formatPriceINR((product.price + Math.random() * 200).toFixed(2))}
          </p>
          <p className="text-lg font-bold text-gray-900">{formatPriceINR(product.price)}</p>
        </div>

        
        <button
          disabled={product.stock === 0 || loading}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(addCartItem(product._id, 1));
          }}
          className={`mt-3 py-2 rounded-lg text-sm font-medium transition-all ${
            product.stock === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm"
          }`}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default Products;
