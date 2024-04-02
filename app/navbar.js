"use client";

import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
import { Fragment, useState, useEffect } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaBars, FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "New Arrivals",
          href: "/discover?arr=true&gen=f&f=true",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg",
          imageAlt:
            "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Basic Tees",
          href: "/discover?cat=top&gen=f&f=true",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt:
            "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "/discover?cat=top&gen=f&f=true" },
            { name: "Pants", href: "/discover?cat=pant&gen=f&f=true" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "/discover?cat=watch&gen=f&f=true" },
            { name: "Bags", href: "/discover?cat=bag&gen=f&f=true" },
            { name: "Sunglasses", href: "/discover?cat=sg&gen=f&f=true" },
            { name: "Hats", href: "/discover?cat=hat&gen=f&f=true" },
          ],
        },
        // {
        //   id: "brands",
        //   name: "Brands",
        //   items: [
        //     { name: "Solo", href: "#" },
        //     { name: "Laura  ", href: "#" },
        //     { name: "Engin", href: "#" },
        //     { name: "Gentle Monster", href: "#" },
        //   ],
        // },
      ],
    },
    {
      id: "men",
      name: "Men",
      featured: [
        {
          name: "New Arrivals",
          href: "/discover?arr=true&gen=m&f=true",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
          imageAlt:
            "Drawstring top with elastic loop closure and textured interior padding.",
        },
        {
          name: "Artwork Tees",
          href: "/discover?cat=top&gen=m&f=true",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg",
          imageAlt:
            "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "/discover?cat=topt&gen=m&f=true" },
            { name: "Pants", href: "/discover?cat=pant&gen=m&f=true" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "/discover?cat=watch&gen=m&f=true" },
            { name: "Bags", href: "/discover?cat=hat&gen=m&f=true" },
            { name: "Sunglasses", href: "/discover?cat=sg&gen=m&f=true" },
            { name: "Hats", href: "/discover?cat=hat&gen=m&f=true" },
          ],
        },
        // {
        //   id: "brands",
        //   name: "Brands",
        //   items: [
        //     { name: "The Bar", href: "#" },
        //     { name: "Solo", href: "#" },
        //     { name: "Nimble", href: "#" },
        //     { name: "Gentle Monster", href: "#" },

        //     { name: "Ray Ban", href: "#" },
        //     { name: "Mellow", href: "#" },
        //   ],
        // },
      ],
    },
  ],
  pages: [{ name: "Discover", href: "/discover" }],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ ocart, setocart }) {
  const cartItems = useSelector((state) => state.cart);

  const [user] = useAuthState(auth);
  const [username, setusername] = useState("");
  const Router = useRouter();
  const logout = async () => {
    try {
      await signOut(auth);
      Router.push("/signin");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (user) {
      if (user.displayName === null) {
        const u1 = user.email.substring(0, user.email.indexOf("@"));
        const uname = u1.charAt(0).toUpperCase() + u1.slice(1);
        setusername(uname);
      } else {
        setusername(user.displayName);
      }
    }
  }, [user]);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="bg-white">
        {/* Mobile menu */}

        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setOpen}
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
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                  <div className="flex px-4 pb-2 pt-5">
                    <button
                      type="button"
                      className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setOpen(false)}
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <IoIosClose className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Links */}
                  <Tab.Group as="div" className="mt-2">
                    <div className="border-b border-gray-200">
                      <Tab.List className="-mb-px flex space-x-8 px-4">
                        {navigation.categories.map((category) => (
                          <Tab
                            key={category.name}
                            className={({ selected }) =>
                              classNames(
                                selected
                                  ? "border-rose-600 text-rose-600"
                                  : "border-transparent text-gray-900",
                                "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium"
                              )
                            }
                          >
                            {category.name}
                          </Tab>
                        ))}
                      </Tab.List>
                    </div>
                    <Tab.Panels as={Fragment}>
                      {navigation.categories.map((category) => (
                        <Tab.Panel
                          key={category.name}
                          className="space-y-10 px-4 pb-8 pt-10"
                        >
                          <div className="grid grid-cols-2 gap-x-4">
                            {category.featured.map((item) => (
                              <div
                                key={item.name}
                                className="group relative text-sm"
                              >
                                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                  <img
                                    src={item.imageSrc}
                                    alt={item.imageAlt}
                                    className="object-cover object-center"
                                  />
                                </div>
                                <a
                                  href={item.href}
                                  className="mt-6 block font-medium text-gray-900"
                                >
                                  <span
                                    className="absolute inset-0 z-10"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                                <p aria-hidden="true" className="mt-1">
                                  Shop now
                                </p>
                              </div>
                            ))}
                          </div>
                          {category.sections.map((section) => (
                            <div key={section.name}>
                              <p
                                id={`${category.id}-${section.id}-heading-mobile`}
                                className="font-medium text-gray-900"
                              >
                                {section.name}
                              </p>
                              <ul
                                role="list"
                                aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                className="mt-6 flex flex-col space-y-6"
                              >
                                {section.items.map((item) => (
                                  <li key={item.name} className="flow-root">
                                    <a
                                      href={item.href}
                                      className="-m-2 block p-2 text-gray-500"
                                    >
                                      {item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>

                  <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                    {navigation.pages.map((page) => (
                      <div key={page.name} className="flow-root">
                        <a
                          href={page.href}
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          {page.name}
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                    {user !== null ? (
                      <>
                        <div className="flow-root">
                          <a
                            href="/dashboard"
                            className="-m-2 block p-2 font-medium text-gray-900 cursor-pointer"
                          >
                            {username}
                          </a>
                        </div>
                        <div className="flow-root">
                          <button onClick={logout}>Logout</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flow-root">
                          <a
                            href="/signin"
                            className="-m-2 block p-2 font-medium text-gray-900"
                          >
                            Sign in
                          </a>
                        </div>
                        <div className="flow-root">
                          <a
                            href="/signup"
                            className="-m-2 block p-2 font-medium text-gray-900"
                          >
                            Create account
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <header className="relative bg-white">
          <p className="flex h-10 items-center justify-center bg-rose-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
            Get free delivery on orders over ₹700
          </p>

          <nav
            aria-label="Top"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="border-b border-gray-200">
              <div className="flex h-16 items-center">
                <button
                  type="button"
                  className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  <FaBars className="h-6 w-6" aria-hidden="true" />{" "}
                </button>

                {/* Logo */}
                <div className="ml-4 flex lg:ml-0">
                  <a href="/">
                    <span className="sr-only">Your Company</span>
                    <img
                      className="h-8 w-auto"
                      src="logos/png/logo.png"
                      alt=""
                    />
                  </a>
                </div>

                {/* Flyout menus */}
                <Popover.Group className="hidden z-10 lg:ml-8 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-8">
                    {navigation.categories.map((category) => (
                      <Popover key={category.name} className="flex">
                        {({ open }) => (
                          <>
                            <div className="relative flex">
                              <Popover.Button
                                className={classNames(
                                  open
                                    ? "border-rose-600 text-rose-600"
                                    : "border-transparent text-gray-700 hover:text-gray-800",
                                  "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                                )}
                              >
                                {category.name}
                              </Popover.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                                {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                <div
                                  className="absolute inset-0 top-1/2 bg-white shadow"
                                  aria-hidden="true"
                                />

                                <div className="relative bg-white">
                                  <div className="mx-auto max-w-7xl px-8">
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                      <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                        {category.featured.map((item) => (
                                          <div
                                            key={item.name}
                                            className="group relative text-base sm:text-sm"
                                          >
                                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                              <img
                                                src={item.imageSrc}
                                                alt={item.imageAlt}
                                                className="object-cover object-center"
                                              />
                                            </div>
                                            <a
                                              href={item.href}
                                              className="mt-6 block font-medium text-gray-900"
                                            >
                                              <span
                                                className="absolute inset-0 z-10"
                                                aria-hidden="true"
                                              />
                                              {item.name}
                                            </a>
                                            <p
                                              aria-hidden="true"
                                              className="mt-1"
                                            >
                                              Shop now
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                        {category.sections.map((section) => (
                                          <div key={section.name}>
                                            <p
                                              id={`${section.name}-heading`}
                                              className="font-medium text-gray-900"
                                            >
                                              {section.name}
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby={`${section.name}-heading`}
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {section.items.map((item) => (
                                                <li
                                                  key={item.name}
                                                  className="flex"
                                                >
                                                  <a
                                                    href={item.href}
                                                    className="hover:text-gray-800"
                                                  >
                                                    {item.name}
                                                  </a>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    ))}

                    {navigation.pages.map((page) => (
                      <a
                        key={page.name}
                        href={page.href}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {page.name}
                      </a>
                    ))}
                  </div>
                </Popover.Group>

                <div className="ml-auto flex items-center">
                  {user !== null ? (
                    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                      <a
                        href="/dashboard"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer"
                      >
                        {username}
                      </a>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <button
                        onClick={logout}
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                      <a
                        href="/signin"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign in
                      </a>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <a
                        href="/signup"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Create account
                      </a>
                    </div>
                  )}
                  {/* Search */}
                  <div className="flex lg:ml-6">
                    <a
                      href="/discover"
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Search</span>
                      <FaSearch className="h-6 w-6" aria-hidden="true" />
                    </a>
                  </div>
                  {/* Cart */}
                  <div className="ml-4 flow-root lg:ml-6">
                    <a
                      onClick={() => {
                        setocart(true);
                      }}
                      className="group -m-2 flex items-center p-2 cursor-pointer"
                    >
                      <MdOutlineShoppingCart
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        {cartItems.length}
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </>
  );
}
