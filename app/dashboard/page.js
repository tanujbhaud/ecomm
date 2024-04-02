"use client";
import Modal from "../modal";
import { useEffect, useState } from "react/";
import { db, auth } from "../config/firebase";

import { useSearchParams } from "next/navigation";

import { useRouter } from "next/navigation";
import moment from "moment";
import toast from "react-hot-toast";
import {
  query,
  collection,
  deleteDoc,
  where,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  orderBy,
  Timestamp,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
export default function Dashboard() {
  const [addressInfo, setAddressInfo] = useState({
    address: "",
    pincode: "",
    mobileNumber: "",
  });

  const [user] = useAuthState(auth);
  const [userq, setuserq] = useState({});
  const [open, setOpen] = useState(false);
  const [formstate, setformstate] = useState("create");
  const [getAllProduct, setGetAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setorders] = useState({});
  const [form, setform] = useState({
    title: "",
    bname: "",
    desc: "",
    price: "",
    img: "",
    gender: "",
    category: "",
  });
  const router = useRouter();
  const getUser = async () => {
    try {
      console.log("userid", user?.uid);

      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const unsubscribeUser = onSnapshot(q, (QuerySnapshot) => {
        let userq;
        QuerySnapshot.forEach((doc) => (userq = doc.data()));
        setuserq(userq);
      });
      return () => unsubscribeUser();
    } catch (error) {
      console.log(error);
    }
  };
  const getShipping = async () => {
    try {
      const q = query(collection(db, "orders"), where("uid", "==", user?.uid));
      const unsubscribeOrders = onSnapshot(q, (QuerySnapshot) => {
        let sq;
        QuerySnapshot.forEach((doc) => (sq = doc.data()));
        setAddressInfo(sq.addressInfo);

        setorders(sq);
        console.log("what is sq", sq);
        const total = sq.cartItems
          .map((item) => item.price * item.quantity)
          .reduce((prevValue, currValue) => prevValue + currValue, 0);
        setCartTotal(total);
        setLoading(false);
      });
      return () => unsubscribeOrders();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getShipping();
    }
  }, [user]);

  const deleteFunction = async () => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            time: Timestamp.now(),
            cartItems: [],
            status: "deleted",
          });
        });

        toast.success("Deleted order sucessfully");
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Failed to delete order");
    }
  };
  const getAllProductFunction = async () => {
    try {
      const q = query(collection(db, "products"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productArray = [];
        QuerySnapshot.forEach((doc) => {
          productArray.push({ ...doc.data(), id: doc.id });
        });
        setGetAllProduct(productArray);
      });
      return () => data;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllProductFunction();
  }, []);
  const [selected, setselected] = useState({ us: true, sh: false });
  const createProduct = async () => {
    if (
      form.title === "" ||
      form.bname === "" ||
      form.desc === "" ||
      form.category === "" ||
      form.price === "" ||
      form.img === "" ||
      form.gender === ""
    ) {
      return toast("All the fields are required");
    } else {
      try {
        const productRef = collection(db, "products");
        await addDoc(productRef, {
          ...form,
          time: Timestamp.now(),
          quantity: 1,
        });
        setOpen(false);

        toast.success("Created Product Successfully");
      } catch (err) {
        console.error(err);
      }
    }
  };
  const updateProduct = async (id) => {
    if (
      form.title === "" ||
      form.bname === "" ||
      form.desc === "" ||
      form.category === "" ||
      form.price === "" ||
      form.img === "" ||
      form.gender === ""
    ) {
      return toast("All the fields are required");
    } else {
      await setDoc(doc(db, "products", id), {
        ...form,
        time: Timestamp.now(),
        quantity: 1,
      });
      setOpen(false);
      setform({
        title: "",
        bname: "",
        desc: "",
        price: "",
        img: "",
        gender: "",
        category: "",
      });
      toast.success("Product Updated Successfully");
    }
  };
  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    toast.success("Product Deleted Successfully");
    router.refresh();
  };

  const shippingFunction = async () => {
    // validation
    if (
      addressInfo.address === "" ||
      addressInfo.pincode === "" ||
      addressInfo.mobileNumber === ""
    ) {
      return toast.error("All fields are required");
    }

    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("uid", "==", userq.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            addressInfo,
            email: userq.email,
            time: Timestamp.now(),
          });
        });
        toast.success("Shipping info updated successfully");
      } else {
        // If document doesn't exist, add a new one
        const orderInfo = {
          addressInfo,
          email: userq.email,
          uid: userq.uid,
          time: Timestamp.now(),
        };
        await addDoc(ordersRef, orderInfo);
        toast.success("Shipping info saved successfully");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Failed to save shipping info");
    }
  };

  const [cartTotal, setCartTotal] = useState(0);
  const deliveryAmount = cartTotal > 700 ? 0 : 60;
  const taxRate = 0.08;
  const taxes = (cartTotal + deliveryAmount) * taxRate;

  const total = cartTotal + deliveryAmount + taxes;

  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (formstate === "create") {
              createProduct();
            } else if (formstate === "edit") {
              updateProduct(form.id);
            }
          }}
          className="space-y-6 p-11"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Title
            </label>
            <div className="mt-2">
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={(e) => {
                  setform({ ...form, title: e.target.value });
                }}
                autoComplete="title"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="bname"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Brand Name
              </label>
            </div>
            <div className="mt-2">
              <input
                id="bname"
                name="bname"
                value={form.bname}
                onChange={(e) => {
                  setform({ ...form, bname: e.target.value });
                }}
                type="text"
                autoComplete="bname"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="desc"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description{" "}
              </label>
            </div>
            <div className="mt-2">
              <input
                id="desc"
                name="desc"
                value={form.desc}
                onChange={(e) => {
                  setform({ ...form, desc: e.target.value });
                }}
                type="text"
                autoComplete="desc"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="Category"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Select a Category
            </label>
            <select
              id="Category"
              value={form.category}
              onChange={(e) => {
                setform({ ...form, category: e.target.value });
                console.log(e.target.value);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            >
              <option defaultValue="">Choose a Category</option>
              <option value="top">Tops</option>
              <option value="pant">Pants</option>
              <option value="sg">Sunglasses</option>
              <option value="bag">Bags</option>

              <option value="hat">Hats</option>

              <option value="watch">Watches</option>
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price (₹)
              </label>
            </div>
            <div className="mt-2">
              <input
                id="price"
                name="price"
                value={form.price}
                onChange={(e) => {
                  setform({ ...form, price: e.target.value });
                }}
                type="number"
                autoComplete="price"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="img"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Image
              </label>
            </div>
            <div className="mt-2">
              <input
                id="img"
                name="img"
                value={form.img}
                onChange={(e) => {
                  setform({ ...form, img: e.target.value });
                }}
                type="text"
                autoComplete="img"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="Gender"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Select Product Gender
            </label>
            <select
              id="gender"
              value={form.gender}
              onChange={(e) => {
                setform({ ...form, gender: e.target.value });
                console.log(e.target.value);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            >
              <option defaultValue="">Choose Product Gender</option>
              <option value="m">Men</option>
              <option value="f">Women</option>
              <option value="b">Unisex</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              {formstate === "create"
                ? "Create"
                : formstate === "edit"
                ? "Edit"
                : ""}
            </button>
          </div>
        </form>
      </Modal>
      <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
        <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
          <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-rose-100 top-12">
            <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
            <a
              onClick={() => {
                setselected({ sh: false, us: true });
              }}
              className={`flex items-center px-3 py-2.5 cursor-pointer${
                selected.us
                  ? "font-bold bg-white  text-rose-900 border rounded-full"
                  : "font-semibold  hover:text-rose-900 hover:border hover:rounded-full "
              }`}
            >
              User Profile
            </a>
            <a
              onClick={() => {
                setselected({ us: false, sh: true });
              }}
              className={`flex items-center px-3 py-2.5 cursor-pointer ${
                selected.sh
                  ? "font-bold bg-white  text-rose-900 border rounded-full"
                  : "font-semibold  hover:text-rose-900 hover:border hover:rounded-full "
              }`}
            >
              Shipping Info
            </a>
          </div>
        </aside>
        <main className="w-full py-1 md:w-2/3 lg:w-3/4">
          <div className="p-2 md:p-4">
            {selected.us ? (
              <>
                <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                  <h2 className=" text-2xl font-bold sm:text-xl">
                    User Profile
                  </h2>
                  <div className="grid max-w-2xl mx-auto mt-8">
                    {/* <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-rose-300 dark:ring-rose-500"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                    alt="Bordered avatar"
                  />
                  <div className="flex flex-col space-y-5 sm:ml-8">
                    <button
                      type="button"
                      className="py-3.5 px-7 text-base font-medium text-rose-100 focus:outline-none bg-[#202142] rounded-lg border border-rose-200 hover:bg-rose-900 focus:z-10 focus:ring-4 focus:ring-rose-200 "
                    >
                      Change picture
                    </button>
                    <button
                      type="button"
                      className="py-3.5 px-7 text-base font-medium text-rose-900 focus:outline-none bg-white rounded-lg border border-rose-200 hover:bg-rose-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-rose-200 "
                    >
                      Delete picture
                    </button>
                  </div>
                </div> */}
                    <div className="items-center  text-[#202142]">
                      <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                        <div className="w-full">
                          <div className="block text-sm font-medium leading-6 text-gray-900">
                            Name{" "}
                          </div>
                          <div className="mt-2">{userq.name}</div>
                        </div>
                        <div className="w-full">
                          <div className="block text-sm font-medium leading-6 text-gray-900">
                            Email
                          </div>
                          <div className="mt-2">{userq.email}</div>
                        </div>
                      </div>
                      <div className="mb-2 sm:mb-6">
                        <div className="w-full">
                          <div className="block text-sm font-medium leading-6 text-gray-900">
                            Date Joined:
                          </div>
                          <div className="mt-2">{userq.date}</div>
                        </div>
                      </div>

                      {userq.role === "admin" ? (
                        <div className="w-full">
                          <div className="block text-sm font-medium leading-6 text-gray-900">
                            Role
                          </div>
                          <div className="mt-2">{userq.role}</div>
                        </div>
                      ) : (
                        " "
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : selected.sh ? (
              <>
                <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                  <h2 className=" text-2xl font-bold sm:text-xl">
                    Shipping Info{" "}
                  </h2>

                  <div className="grid max-w-2xl mx-auto mt-8">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        shippingFunction();
                      }}
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
                                Mobile Number
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
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </main>
      </div>
      {loading ? (
        <></>
      ) : (
        <section className="py-5 relative">
          <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
            <h2 className="font-manrope font-bold text-4xl leading-10 text-black text-center">
              Order Details
            </h2>
            <p className="mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center">
              {orders.cartItems.length > 1
                ? "Thanks for making a purchase you can check the order summary below"
                : "Your placed orders will appear here"}
            </p>
            {orders.cartItems.length > 1 ? (
              <>
                <div className="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                    <div className="data">
                      {/* <p className="font-semibold text-base leading-7 text-black">
                  Order Id:
                  <span className="text-rose-600 font-medium">#10234987</span>
                </p> */}
                      <p className="font-semibold text-base leading-7 text-black mt-4">
                        Order Date :
                        <span className="pl-4 text-gray-400 font-medium">
                          {moment(orders.time.toDate()).format("MMMM Do YYYY")}
                        </span>
                      </p>
                    </div>
                    {/* <button className="rounded-full py-3 px-7 font-semibold text-sm leading-7 text-white bg-rose-600 max-lg:mt-5 shadow-sm shadow-transparent transition-all duration-500 hover:bg-rose-700 hover:shadow-rose-400">
                  Track Your Order
                </button> */}
                  </div>
                  <div className="w-full px-3 min-[400px]:px-6">
                    {orders.cartItems.map((item, index) => {
                      return (
                        <>
                          <div
                            className={`flex flex-col lg:flex-row items-center py-6 gap-6 w-full ${
                              orders.cartItems.length === index + 1
                                ? ""
                                : "border-b border-gray-200"
                            }`}
                          >
                            <div className="img-box max-lg:w-full">
                              <img
                                src={item.img}
                                alt="Order img"
                                className="aspect-square w-full lg:max-w-[140px]"
                              />
                            </div>
                            <div className="flex flex-row items-center w-full ">
                              <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
                                <div className="flex items-center">
                                  <div className="">
                                    <h2 className="font-semibold text-xl leading-8 text-black mb-3">
                                      {item.title}
                                    </h2>
                                    <p className="font-normal text-lg leading-8 text-gray-500 mb-3 ">
                                      {item.bname}
                                    </p>
                                    <div className="flex items-center ">
                                      {/* <p className="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                                    Size:{" "}
                                    <span className="text-gray-500">
                                      100 ml
                                    </span>
                                  </p> */}
                                      <p className="font-medium text-base leading-7 text-black ">
                                        Qty:{" "}
                                        <span className="text-gray-500">
                                          {item.quantity}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-5">
                                  <div className="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                                    <div className="flex gap-3 lg:block">
                                      <p className="font-medium text-sm leading-7 text-black">
                                        price
                                      </p>
                                      <p className="lg:mt-4 font-medium text-sm leading-7 text-rose-600">
                                        ₹{item.price}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                                    <div className="flex gap-3 lg:block">
                                      <p className="font-medium text-sm leading-7 text-black">
                                        Status
                                      </p>
                                      <p className="font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 bg-emerald-50 text-emerald-600">
                                        Ready for Delivery
                                      </p>
                                    </div>
                                  </div>
                                  {/* <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                                <div className="flex gap-3 lg:block">
                                  <p className="font-medium text-sm whitespace-nowrap leading-6 text-black">
                                    Expected Delivery Time
                                  </p>
                                  <p className="font-medium text-base whitespace-nowrap leading-7 lg:mt-3 text-emerald-500">
                                    23rd March 2021
                                  </p>
                                </div>
                              </div> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                    {/* <div className="flex flex-col lg:flex-row items-center py-6 gap-6 w-full">
                  <div className="img-box max-lg:w-full">
                    <img
                      src="https://pagedone.io/asset/uploads/1701167621.png"
                      alt="Diamond Watch image"
                      className="aspect-square w-full lg:max-w-[140px]"
                    />
                  </div>
                  <div className="flex flex-row items-center w-full ">
                    <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
                      <div className="flex items-center">
                        <div className="">
                          <h2 className="font-semibold text-xl leading-8 text-black mb-3 ">
                            Diamond Platinum Watch
                          </h2>
                          <p className="font-normal text-lg leading-8 text-gray-500 mb-3">
                            Diamond Dials
                          </p>
                          <div className="flex items-center  ">
                            <p className="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                              Size:{" "}
                              <span className="text-gray-500">Regular</span>
                            </p>
                            <p className="font-medium text-base leading-7 text-black ">
                              Qty: <span className="text-gray-500">1</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-5">
                        <div className="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                          <div className="flex gap-3 lg:block">
                            <p className="font-medium text-sm leading-7 text-black">
                              price
                            </p>
                            <p className="lg:mt-4 font-medium text-sm leading-7 text-rose-600">
                              ₹100
                            </p>
                          </div>
                        </div>
                        <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                          <div className="flex gap-3 lg:block">
                            <p className="font-medium text-sm leading-7 text-black">
                              Status
                            </p>
                            <p className="font-medium text-sm leading-6 py-0.5 px-3 whitespace-nowrap rounded-full lg:mt-3 bg-rose-50 text-rose-600">
                              Dispatched
                            </p>
                          </div>
                        </div>
                        <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                          <div className="flex gap-3 lg:block">
                            <p className="font-medium text-sm whitespace-nowrap leading-6 text-black">
                              Expected Delivery Time
                            </p>
                            <p className="font-medium text-base whitespace-nowrap leading-7 lg:mt-3 text-emerald-500">
                              23rd March 2021
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                  </div>
                  <div className="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between ">
                    <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200">
                      <button
                        onClick={deleteFunction}
                        className="flex outline-0 py-6 sm:pr-6  sm:border-r border-gray-200 whitespace-nowrap gap-2 items-center justify-center font-semibold group text-lg text-black bg-white transition-all duration-500 hover:text-rose-600"
                      >
                        <svg
                          className="stroke-black transition-all duration-500 group-hover:stroke-rose-600"
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={22}
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <path
                            d="M5.5 5.5L16.5 16.5M16.5 5.5L5.5 16.5"
                            stroke=""
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                        Cancel Order
                      </button>
                      <p className="font-medium text-lg text-gray-900 pl-6 py-3 max-lg:text-center">
                        Cash on Delivery
                        {/* <span className="text-gray-500">ending with 8822</span> */}
                      </p>
                    </div>
                    <p className="font-semibold text-lg text-black py-6">
                      Total Price (including tax and delivery charges):{" "}
                      <span className="text-rose-600">
                        {" "}
                        ₹{total.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </section>
      )}

      {userq.role === "admin" ? (
        <>
          <section className="py-5 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
              <h2 className="font-manrope font-bold text-4xl leading-10 text-black text-center">
                Admin Table
              </h2>
              <p className="mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center">
                Only visible to Admin
              </p>
            </div>
          </section>
          <div className="px-4 mb-5">
            <button
              onClick={() => {
                setOpen(true);
                setformstate("create");
              }}
              className="flex justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              Create Product
            </button>
          </div>
          <div className="px-4 mb-20 relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Brand Name{" "}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description{" "}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Image url
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Gender{" "}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date{" "}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Edit{" "}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {getAllProduct.map((item) => {
                  return (
                    <tr key={item.id} className="bg-white border-b  ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {item.title.length < 20 ? (
                          <>{item.title} </>
                        ) : (
                          <>{item.title.substring(0, 20)}...</>
                        )}
                      </th>
                      <td className="px-6 py-4">{item.bname}</td>
                      <td className="px-6 py-4">
                        {item.desc.length < 20 ? (
                          <>{item.desc} </>
                        ) : (
                          <>{item.desc.substring(0, 20)}...</>
                        )}
                      </td>
                      <td className="px-6 py-4">{item.category}</td>
                      <td className="px-6 py-4">₹{item.price}</td>
                      <td className="px-6 py-4">
                        <img className="w-10" src={item.img} />
                      </td>
                      <td className="px-6 py-4">{item.gender}</td>

                      <td className="px-6 py-4">
                        {moment(item.time.toDate()).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setOpen(true);
                            setform({ ...item });
                            setformstate("edit");
                          }}
                          className="flex justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                        >
                          Edit
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            deleteProduct(item.id);
                          }}
                          className="flex justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {/* <tr className="bg-white border-b  ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    Apple MacBook Pro 17"
                  </th>
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Laptop</td>
                  <td className="px-6 py-4">₹2999</td>
                </tr>
                <tr className="bg-white border-b  ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    Microsoft Surface Pro
                  </th>
                  <td className="px-6 py-4">White</td>
                  <td className="px-6 py-4">Laptop PC</td>
                  <td className="px-6 py-4">₹1999</td>
                </tr>
                <tr className="bg-white ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    Magic Mouse 2
                  </th>
                  <td className="px-6 py-4">Black</td>
                  <td className="px-6 py-4">Accessories</td>
                  <td className="px-6 py-4">₹99</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
