"use client";
import { useState, useEffect } from "react";
import { db } from "./config/firebase";
import {
  query,
  orderBy,
  collection,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "./redux/cartSlice";
import toast from "react-hot-toast";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from "./redux/productSlice";

export default function Plist() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  const cartItems = useSelector((state) => state.cart);
  const fetched = useSelector((state) => state.products.fetched); // Get the fetched flag

  useEffect(() => {
    // Check if products have already been fetched
    if (!fetched) {
      const getAllProductFunction = async () => {
        try {
          dispatch(fetchProductsStart());
          const q = query(
            collection(db, "products"),
            orderBy("time"),
            limit(4)
          );
          const data = onSnapshot(q, (QuerySnapshot) => {
            let productArray = [];
            QuerySnapshot.forEach((doc) => {
              productArray.push({ ...doc.data(), id: doc.id });
            });
            dispatch(fetchProductsSuccess(productArray));
          });
          return data;
        } catch (error) {
          dispatch(fetchProductsFailure(error.message));
          console.error(error);
        }
      };

      getAllProductFunction();
    }
  }, [dispatch, fetched]); // Include fetched in the dependencies array

  // add to cart function
  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("Added to cart");
  };

  // delete from cart function
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Deleted from cart");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center" role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-manrope font-bold text-3xl min-[400px]:text-4xl text-black mb-8 max-lg:text-center">
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {products?.slice(0, 4).map((product) => (
              <>
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="max-w-[384px] mx-auto"
                >
                  <div className="w-full max-w-sm aspect-square">
                    <img
                      src={product.img}
                      alt={"Trending product"}
                      className="w-full h-full object-cover object-center rounded-xl"
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="">
                      <h6 className="font-medium text-xl leading-8 text-black mb-2">
                        {product.title}
                      </h6>
                      <h6 className="font-semibold text-xl leading-8 text-rose-600">
                        ₹ {product.price}
                      </h6>
                    </div>
                    {cartItems.some((p) => p.id === product.id) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteCart(product);
                        }}
                        className="p-2 min-[400px]:p-4 rounded-full bg-rose-600 border border-gray-300 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50"
                      >
                        <svg
                          className="stroke-white transition-all duration-500 group-hover:stroke-black"
                          xmlns="http://www.w3.org/2000/svg"
                          width={26}
                          height={26}
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <path
                            d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25"
                            stroke=""
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addCart(product);
                        }}
                        className="p-2 min-[400px]:p-4 rounded-full bg-white border border-gray-300 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50"
                      >
                        <svg
                          className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                          xmlns="http://www.w3.org/2000/svg"
                          width={26}
                          height={26}
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <path
                            d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25"
                            stroke=""
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </a>
              </>
            ))}
            {/* <a href="javascript:;" className="max-w-[384px] mx-auto">
              <div className="w-full max-w-sm aspect-square">
                <img
                  src="https://pagedone.io/asset/uploads/1701157806.png"
                  alt="cream image"
                  className="w-full h-full rounded-xl"
                />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="">
                  <h6 className="font-medium text-xl leading-8 text-black mb-2">
                    Skin care cream
                  </h6>
                  <h6 className="font-semibold text-xl leading-8 text-rose-600">
                    $74.99
                  </h6>
                </div>
                <button className="p-2 min-[400px]:p-4 rounded-full bg-white border border-gray-300 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50">
                  <svg
                    className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width={26}
                    height={26}
                    viewBox="0 0 26 26"
                    fill="none"
                  >
                    <path
                      d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25"
                      stroke=""
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </a>
            <a href="javascript:;" className="max-w-[384px] mx-auto">
              <div className="w-full max-w-sm aspect-square">
                <img
                  src="https://pagedone.io/asset/uploads/1701157826.png"
                  alt="cream image"
                  className="w-full h-full rounded-xl"
                />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="">
                  <h6 className="font-medium text-xl leading-8 text-black mb-2">
                    Men’s Facial
                  </h6>
                  <h6 className="font-semibold text-xl leading-8 text-rose-600">
                    $25
                  </h6>
                </div>
                <button className="p-2 min-[400px]:p-4 rounded-full bg-white border border-gray-300 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50">
                  <svg
                    className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width={26}
                    height={26}
                    viewBox="0 0 26 26"
                    fill="none"
                  >
                    <path
                      d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25"
                      stroke=""
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </a>
            <a href="" className="max-w-[384px] mx-auto">
              <div className="w-full max-w-sm aspect-square relative">
                <img
                  src="https://pagedone.io/asset/uploads/1701157844.png"
                  alt="serum bottle image"
                  className="w-full h-full rounded-xl"
                />
                <span className="py-1 min-[400px]:py-2 px-2 min-[400px]:px-4 cursor-pointer rounded-lg bg-gradient-to-tr from-rose-600 to-purple-600 font-medium text-base leading-7 text-white absolute top-3 right-3 z-10">
                  20% Off
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="">
                  <h6 className="font-medium text-xl leading-8 text-black mb-2">
                    Dark circles serum
                  </h6>
                  <h6 className="font-semibold text-xl leading-8 text-rose-600">
                    $199.99
                  </h6>
                </div>
                <button className="p-2 min-[400px]:p-4 rounded-full bg-white border border-gray-300 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50">
                  <svg
                    className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width={26}
                    height={26}
                    viewBox="0 0 26 26"
                    fill="none"
                  >
                    <path
                      d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25"
                      stroke=""
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </a> */}
          </div>
        </div>
      </section>
    </>
  );
}
