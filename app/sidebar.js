"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { db } from "./config/firebase";

import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "./redux/cartSlice";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { FaChevronDown } from "react-icons/fa";
import { useParams } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { FaMinus } from "react-icons/fa6";
import { IoGrid } from "react-icons/io5";

import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from "./redux/productSlice";
import moment from "moment";
const initialState = {
  category: [
    { value: "top", label: "Tops", checked: false },
    { value: "pant", label: "Pants", checked: false },
    { value: "sg", label: "Sunglasses", checked: false },
    { value: "bag", label: "Bags", checked: false },
    { value: "hat", label: "Hats", checked: false },
    { value: "watch", label: "Watches", checked: false },
  ],
  gender: [
    { value: "m", label: "Men", checked: false },
    { value: "f", label: "Women", checked: false },
    { value: "b", label: "Unisex", checked: false },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState(initialState);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [current, setcurrent] = useState({
    r: true,
    n: false,
    lth: false,
    htl: false,
  });
  const dispatch = useDispatch();
  const pros = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  const cartItems = useSelector((state) => state.cart);
  const fetched = useSelector((state) => state.products.fetched);

  useEffect(() => {
    // Check if products have already been fetched
    if (!fetched) {
      const getAllProductFunction = async () => {
        try {
          dispatch(fetchProductsStart());
          const q = query(collection(db, "products"), orderBy("time"));
          const data = onSnapshot(q, (QuerySnapshot) => {
            let productArray = [];
            QuerySnapshot.forEach((doc) => {
              productArray.push({ ...doc.data(), id: doc.id });
            });
            dispatch(fetchProductsSuccess(productArray));
            setFilteredProducts(productArray);
          });
          return data;
        } catch (error) {
          dispatch(fetchProductsFailure(error.message));
          console.error(error);
        }
      };

      getAllProductFunction();
    }
  }, [dispatch, fetched]);
  const handleCheckboxChange = (sectionId, optionIdx) => {
    const updatedFilters = { ...filters };
    updatedFilters[sectionId][optionIdx].checked =
      !updatedFilters[sectionId][optionIdx].checked;
    setFilters(updatedFilters);
  };

  const handleFilterButtonClick = () => {
    const selectedCategoryFilters = filters.category
      .filter((c) => c.checked)
      .map((c) => c.value);
    const selectedGenderFilters = filters.gender
      .filter((g) => g.checked)
      .map((g) => g.value);

    const filtered = pros.filter((product) => {
      const categoryMatch = selectedCategoryFilters.includes(product.category);
      const genderMatch = selectedGenderFilters.includes(product.gender);

      return categoryMatch && genderMatch;
    });

    setFilteredProducts(filtered);
  };

  const handleClearFilters = () => {
    setFilters(initialState);
    setFilteredProducts(pros);
  };

  const sortOptions = [
    {
      name: "Relevant",
      onClick: () => {
        setFilteredProducts(pros);
        setcurrent({
          r: true,
          n: false,
          lth: false,
          htl: false,
        });
      },
      current: current.r,
    },

    {
      name: "Newest",
      onClick: () => {
        const sortedProducts = [...filteredProducts];
        sortedProducts.sort(
          (a, b) =>
            new Date(moment(b.time.toDate())) -
            new Date(moment(a.time.toDate()))
        );

        setFilteredProducts(sortedProducts);
        setcurrent({
          r: false,
          n: true,
          lth: false,
          htl: false,
        });
      },
      current: current.n,
    },
    {
      name: "Price: Low to High",
      onClick: () => {
        const sortedProducts = [...filteredProducts];
        sortedProducts.sort((a, b) => a.price - b.price);

        setFilteredProducts(sortedProducts);
        setcurrent({
          r: false,
          n: false,
          lth: true,
          htl: false,
        });
      },
      current: current.lth,
    },
    {
      name: "Price: High to Low",
      onClick: () => {
        const sortedProducts = [...filteredProducts];
        sortedProducts.sort((a, b) => b.price - a.price);

        setFilteredProducts(sortedProducts);
        setcurrent({
          r: false,
          n: false,
          lth: false,
          htl: true,
        });
      },
      current: current.htl,
    },
  ];

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

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <IoIosClose className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    {/* <h3 className="sr-only">Categories</h3> */}
                    {/* <ul
                      role="list"
                      className="px-2 py-3 font-medium text-gray-900"
                    >
                      {subCategories.map((category) => (
                        <li key={category.name}>
                          <a href={category.href} className="block px-2 py-3">
                            {category.name}
                          </a>
                        </li>
                      ))}
                    </ul> */}
                    {Object.keys(filters).map((sectionId) => (
                      <Disclosure
                        as="div"
                        key={sectionId}
                        className="border-b border-gray-200 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {sectionId}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <FaMinus
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <FaPlus
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-4">
                                {filters[sectionId].map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-${sectionId}-${optionIdx}`}
                                      name={`${sectionId}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      checked={option.checked}
                                      onChange={() =>
                                        handleCheckboxChange(
                                          sectionId,
                                          optionIdx
                                        )
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-${sectionId}-${optionIdx}`}
                                      className="ml-3 text-sm text-gray-600"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                    <button
                      type="button"
                      className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                      onClick={handleFilterButtonClick}
                    >
                      Filter
                    </button>

                    <button
                      type="button"
                      className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                      onClick={handleClearFilters}
                    >
                      Clear All filters
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Discover
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <FaChevronDown
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option, index) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              key={index}
                              onClick={option.onClick}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm cursor-pointer"
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FaFilter className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                {/* <h3 className="sr-only">Categories</h3>
                <ul
                  role="list"
                  className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                >
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a href={category.href}>{category.name}</a>
                    </li>
                  ))}
                </ul> */}

                {Object.keys(filters).map((sectionId) => (
                  <Disclosure
                    as="div"
                    key={sectionId}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {sectionId}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <FaMinus
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <FaPlus
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {filters[sectionId].map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${sectionId}-${optionIdx}`}
                                  name={`${sectionId}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  checked={option.checked}
                                  onChange={() =>
                                    handleCheckboxChange(sectionId, optionIdx)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${sectionId}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}

                <button
                  type="button"
                  className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                  onClick={handleFilterButtonClick}
                >
                  Filter
                </button>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  {filteredProducts.map((product) => (
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
                            <h6 className="font-semibold text-xl leading-8 text-indigo-600">
                              ₹ {product.price}
                            </h6>
                          </div>
                          {cartItems.some((p) => p.id === product.id) ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                deleteCart(product);
                              }}
                              className="p-2 min-[400px]:p-4 rounded-full bg-indigo-600 border border-gray-300 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50"
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
                  {filteredProducts.length === 0 ? "No Results found" : ""}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
