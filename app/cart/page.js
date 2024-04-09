"use client";

import { auth } from "../config/firebase";
import { useRouter } from "next/navigation";
import Modal from "../modal";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  decrement,
  deleteFromCart,
  incrementQuantity,
  emptyCart,
} from "../redux/cartSlice";
import toast from "react-hot-toast";
import {
  Timestamp,
  addDoc,
  collection,
  where,
  updateDoc,
  query,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
// const products = [
//   {
//     id: 1,
//     name: "Throwback Hip Bag",
//     href: "#",
//     color: "Salmon",
//     price: "₹90.00",
//     quantity: 1,
//     imageSrc:
//       "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
//     imageAlt:
//       "Salmon rose fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.",
//   },
//   {
//     id: 2,
//     name: "Medium Stuff Satchel",
//     href: "#",
//     color: "Blue",
//     price: "₹32.00",
//     quantity: 1,
//     imageSrc:
//       "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
//     imageAlt:
//       "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
//   },
//   // More products...
// ];
export default function CartPage() {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  // const cartQuantity = cartItems.length;

  const cartTotal = cartItems
    .map((item) => item.price * item.quantity)
    .reduce((prevValue, currValue) => prevValue + currValue, 0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // user
  const [user] = useAuthState(auth);
  // Buy Now Function
  const [addressInfo, setAddressInfo] = useState({
    address: "",
    pincode: "",
    mobileNumber: "",
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  const deliveryAmount = cartTotal > 700 ? 0 : 60;
  const taxRate = 0.08;
  const taxes = (cartTotal + deliveryAmount) * taxRate;

  const total = cartTotal + deliveryAmount + taxes;
  const shippingFunction = async () => {
    // validation
    console.log(user.email, user.uid);

    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            time: Timestamp.now(),
            cartItems,
            status: "confirmed",
          });
        });
        dispatch(emptyCart());
        toast.success("Order Placed Successfully");
        router.push("/dashboard");
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Failed to save shipping info");
    }
  };
  const addressSubmit = async () => {
    if (
      addressInfo.address === "" ||
      addressInfo.pincode === "" ||
      addressInfo.mobileNumber === ""
    ) {
      return toast.error("All fields are required");
    }
    const ordersRef = collection(db, "orders");
    const orderInfo = {
      addressInfo,
      email: user.email,
      uid: user.uid,
      time: Timestamp.now(),
    };
    await addDoc(ordersRef, orderInfo);
    toast.success("Shipping info saved successfully");
    setOpen(false);
    // continue with checkout
  };
  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addressSubmit();
          }}
          className="space-y-6 p-11"
        >
          <div className="items-center  text-[#202142]">
            <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Address
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="address"
                    name="address"
                    value={addressInfo.address}
                    onChange={(e) => {
                      setAddressInfo({
                        ...addressInfo,
                        address: e.target.value,
                      });
                    }}
                    type="text"
                    autoComplete="address"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="w-full">
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Pincode{" "}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="pincode"
                      name="pincode"
                      value={addressInfo.pincode}
                      onChange={(e) => {
                        setAddressInfo({
                          ...addressInfo,
                          pincode: e.target.value,
                        });
                      }}
                      type="number"
                      autoComplete="pincode"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-2 sm:mb-6">
              <div className="w-full">
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    MobileNumber Number
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    value={addressInfo.mobileNumber}
                    onChange={(e) => {
                      setAddressInfo({
                        ...addressInfo,
                        mobileNumber: e.target.value,
                      });
                    }}
                    type="number"
                    autoComplete="mobileNumber"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white bg-rose-700  hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>
      <div className="flex h-full flex-col bg-white shadow-xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between">
            <div className="ml-3 flex h-7 items-center"></div>
          </div>

          <div className="mt-8">
            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {cartItems?.map((product) => (
                  <li key={product.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={product.img}
                        alt={"cart item image"}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={`/product/${product.id}`}>
                              {product.title}
                            </a>
                          </h3>
                          <p className="ml-4">₹{product.price}</p>
                        </div>
                        {/* <p className="mt-1 text-sm text-gray-500">
                                        {product.category}{" "}
                                      </p> */}
                      </div>
                      <div className="flex flex-1 items-end text-sm">
                        <button
                          onClick={() => handleDecrement(product.id)}
                          type="button"
                          className="h-7 w-7"
                        >
                          -
                        </button>

                        <p className="text-gray-500">Qty {product.quantity}</p>
                        <button
                          onClick={() => handleIncrement(product.id)}
                          type="button"
                          className="flex h-7 w-7 items-center justify-center"
                        >
                          +
                        </button>
                        <div className="flex">
                          <button
                            onClick={() => deleteCart(product)}
                            type="button"
                            className="font-medium text-rose-600 hover:text-rose-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {cartItems.length > 0 ? (
          <>
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal: </p>
                <p>₹{cartTotal}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Shipping: </p>
                <p>{cartTotal > 700 ? <>FREE</> : <>₹60</>}</p>
              </div>

              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Taxes (8%:): </p>
                <p>₹{taxes.toFixed(2)}</p>
              </div>

              <div class="mt-6 flex items-center justify-between">
                <p class="text-base font-medium text-gray-900">Total</p>
                <p class="text-2xl font-semibold text-gray-900">
                  ₹{total.toFixed(2)}
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => {
                    if (user) {
                      shippingFunction();
                    } else {
                      router.push("/signin");
                    }
                  }}
                  className="flex items-center justify-center rounded-md border border-transparent bg-rose-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-rose-700"
                >
                  Checkout
                </button>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or{" "}
                  <button
                    type="button"
                    className="font-medium text-rose-600 hover:text-rose-500"
                    onClick={() => setOpen(false)}
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
