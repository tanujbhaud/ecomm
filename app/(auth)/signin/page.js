"use client";
import { auth } from "../../config/firebase";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Signin() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);
  const [form, setform] = useState({ email: "", password: "" });

  const signin = async () => {
    if (form.email !== "" && form.password !== "") {
      try {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        toast.success("Successfully signed in");
        router.push("/");
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    } else {
      toast.error("Please fill the complete details");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="logos/png/logo.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signin();
            }}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setform({ ...form, email: e.target.value });
                  }}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="/forgotpw"
                    className="font-semibold text-rose-600 hover:text-rose-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={(e) => {
                    setform({ ...form, password: e.target.value });
                  }}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <a
              href="/signup"
              className="font-semibold leading-6 text-rose-600 hover:text-rose-500"
            >
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
