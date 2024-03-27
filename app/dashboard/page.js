"use client";
import Modal from "../modal";
import { useEffect, useState } from "react/";
import { db, auth } from "../config/firebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [userq, setuserq] = useState({});
  const [open, setOpen] = useState(false);
  const [form, setform] = useState({});
  const userValidFunction = async () => {
    // validation
    if (user) {
      try {
        console.log("userid", user?.uid);

        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        onSnapshot(q, (QuerySnapshot) => {
          let userq;
          QuerySnapshot.forEach((doc) => (userq = doc.data()));
          setuserq(userq);
          console.log("what is userq", userq);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    userValidFunction();
  }, [user]);

  return (
    <>
      <Modal></Modal>
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500"></p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userq.name}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userq.email}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Date Joined:
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userq.date}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">User ID:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userq.uid}
              </dd>
            </div>
            {userq.role === "admin" ? (
              <>
                {" "}
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Role:</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userq.role}
                  </dd>
                </div>
              </>
            ) : (
              ""
            )}

            {/* <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                123 Main St
                <br />
                Anytown, USA 12345
              </dd>
            </div> */}
          </dl>
        </div>
      </div>

      <section className="py-24 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
          <h2 className="font-manrope font-bold text-4xl leading-10 text-black text-center">
            Order Details
          </h2>
          <p className="mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center">
            Thanks for making a purchase you can check our order summary below
          </p>
          <div className="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
              <div className="data">
                <p className="font-semibold text-base leading-7 text-black">
                  Order Id:{" "}
                  <span className="text-indigo-600 font-medium">#10234987</span>
                </p>
                <p className="font-semibold text-base leading-7 text-black mt-4">
                  Order Payment :{" "}
                  <span className="text-gray-400 font-medium">
                    {" "}
                    18th march 2021
                  </span>
                </p>
              </div>
              <button className="rounded-full py-3 px-7 font-semibold text-sm leading-7 text-white bg-indigo-600 max-lg:mt-5 shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400">
                Track Your Order
              </button>
            </div>
            <div className="w-full px-3 min-[400px]:px-6">
              <div className="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
                <div className="img-box max-lg:w-full">
                  <img
                    src="https://pagedone.io/asset/uploads/1701167607.png"
                    alt="Premium Watch image"
                    className="aspect-square w-full lg:max-w-[140px]"
                  />
                </div>
                <div className="flex flex-row items-center w-full ">
                  <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
                    <div className="flex items-center">
                      <div className="">
                        <h2 className="font-semibold text-xl leading-8 text-black mb-3">
                          Premium Quality Dust Watch
                        </h2>
                        <p className="font-normal text-lg leading-8 text-gray-500 mb-3 ">
                          By: Dust Studios
                        </p>
                        <div className="flex items-center ">
                          <p className="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                            Size: <span className="text-gray-500">100 ml</span>
                          </p>
                          <p className="font-medium text-base leading-7 text-black ">
                            Qty: <span className="text-gray-500">2</span>
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
                          <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">
                            $100
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
              </div>
              <div className="flex flex-col lg:flex-row items-center py-6 gap-6 w-full">
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
                            Size: <span className="text-gray-500">Regular</span>
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
                          <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">
                            $100
                          </p>
                        </div>
                      </div>
                      <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                        <div className="flex gap-3 lg:block">
                          <p className="font-medium text-sm leading-7 text-black">
                            Status
                          </p>
                          <p className="font-medium text-sm leading-6 py-0.5 px-3 whitespace-nowrap rounded-full lg:mt-3 bg-indigo-50 text-indigo-600">
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
              </div>
            </div>
            <div className="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between ">
              <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200">
                <button className="flex outline-0 py-6 sm:pr-6  sm:border-r border-gray-200 whitespace-nowrap gap-2 items-center justify-center font-semibold group text-lg text-black bg-white transition-all duration-500 hover:text-indigo-600">
                  <svg
                    className="stroke-black transition-all duration-500 group-hover:stroke-indigo-600"
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
                  Paid using Credit Card{" "}
                  <span className="text-gray-500">ending with 8822</span>
                </p>
              </div>
              <p className="font-semibold text-lg text-black py-6">
                Total Price: <span className="text-indigo-600"> $200.00</span>
              </p>
            </div>
            <div>
              {" "}
              <button
                onClick={() => {
                  setOpen(true);
                }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Product{" "}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
