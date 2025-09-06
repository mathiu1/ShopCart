import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewProduct } from "../../actions/productActions";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { clearError, clearProductCreated } from "../../slices/productSlice";
import MetaData from "../../components/MetaData";

const categories = [
  "Electronics",
  "Mobile Phones",
  "Laptops",
  "Accessories",
  "Headphones",
  "Food",
  "Books",
  "Clothes/Shoes",
  "Beauty/Health",
  "Sports",
  "Outdoor",
  "Home",
];

const NewProduct = ({ navigate }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // Validation state
  const [errors, setErrors] = useState({});

  const { uploadLoading, error, isProductCreated } = useSelector(
    (state) => state.productState
  );

  const dispatch = useDispatch();

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length === 0) return;
    setImages(imageFiles);
    const previews = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);

    // Clear image error if any
    if (imageFiles.length > 0) setErrors((prev) => ({ ...prev, images: null }));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewImages];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviewImages(newPreviews);

    if (newImages.length === 0)
      setErrors((prev) => ({ ...prev, images: "Upload at least one image" }));
  };

  // Real-time validation helpers
  const validateField = (field, value) => {
    switch (field) {
      case "name":
        setErrors((prev) => ({
          ...prev,
          name: value.trim() ? null : "Product name is required",
        }));
        break;
      case "price":
        setErrors((prev) => ({
          ...prev,
          price:
            value && !isNaN(value) && Number(value) > 0
              ? null
              : "Price must be greater than 0",
        }));
        break;
      case "stock":
        setErrors((prev) => ({
          ...prev,
          stock:
            value && !isNaN(value) && Number(value) >= 0
              ? null
              : "Stock cannot be negative",
        }));
        break;
      case "seller":
        setErrors((prev) => ({
          ...prev,
          seller: value.trim() ? null : "Seller name is required",
        }));
        break;
      case "category":
        setErrors((prev) => ({
          ...prev,
          category: value ? null : "Category is required",
        }));
        break;
      case "description":
        setErrors((prev) => ({
          ...prev,
          description: value.trim() ? null : "Description is required",
        }));
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!price || isNaN(price) || Number(price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!stock || isNaN(stock) || Number(stock) < 0)
      newErrors.stock = "Stock cannot be negative";
    if (!seller.trim()) newErrors.seller = "Seller name is required";
    if (!category) newErrors.category = "Category is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (images.length === 0) newErrors.images = "Upload at least one image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("seller", seller);
    images.forEach((img) => formData.append("images", img));

    dispatch(createNewProduct(formData));
  };

  useEffect(() => {
    if (isProductCreated) {
      toast.success("Product Create Successfully");
      dispatch(clearProductCreated());
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setSeller("");
      setImages([]);
      setPreviewImages([]);
      setErrors({});
      navigate("allProducts");
    }

    if (error) {
      toast.error("Product Create Failed");
      dispatch(clearError());
    }
  }, [isProductCreated, error]);

  const inputClass = (field) =>
    `w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-indigo-500"
    } shadow-sm`;

  return (
    <div className="max-w-3xl text-sm md:text-base mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      <MetaData title={"Add New Product"} />
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateField("name", e.target.value);
            }}
            placeholder="Enter product name"
            className={inputClass("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              validateField("price", e.target.value);
            }}
            placeholder="Enter price"
            className={inputClass("price")}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
              validateField("stock", e.target.value);
            }}
            placeholder="Stock quantity"
            className={inputClass("stock")}
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
          )}
        </div>

        {/* Seller Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Seller Name
          </label>
          <input
            type="text"
            value={seller}
            onChange={(e) => {
              setSeller(e.target.value);
              validateField("seller", e.target.value);
            }}
            placeholder="Enter seller name"
            className={inputClass("seller")}
          />
          {errors.seller && (
            <p className="text-red-500 text-sm mt-1">{errors.seller}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              validateField("category", e.target.value);
            }}
            className={inputClass("category")}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              validateField("description", e.target.value);
            }}
            placeholder="Enter product description"
            className={inputClass("description")}
            rows={5}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Product Images
          </label>
          <div
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition ${
              errors.images
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
            }`}
            onClick={() => document.getElementById("product-images").click()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0l-3 3m3-3l3 3m6 0v12m0 0l3-3m-3 3l-3-3"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click or drag files</span>
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF (up to 5 files)
              </p>
            </div>
            <input
              type="file"
              id="product-images"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              accept="image/*"
              className="hidden"
            />
            
          </div>
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}

          {/* Preview Images with remove button */}
          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {previewImages.map((img, i) => (
                <div
                  key={i}
                  className="w-18 h-18 md:w-28 md:h-28 border rounded-lg overflow-hidden shadow-sm relative"
                >
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploadLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold text-lg transition shadow-md hover:shadow-lg"
        >
          {uploadLoading ? "Loading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default NewProduct;
