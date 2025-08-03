"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24'>
      <div className='max-w-md w-full space-y-8'>
        <div className='bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-extrabold text-gray-900'>
              Sign in to your account
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Or{" "}
              <Link
                href='/signup'
                className='font-medium text-gray-900 hover:text-gray-700 transition-colors duration-300'
              >
                create a new account
              </Link>
            </p>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit}>
            {error && (
              <div className='bg-red-50/70 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl'>
                {error}
              </div>
            )}

            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='text-sm font-medium text-gray-700 mb-2 block'
                >
                  Email address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='w-full px-4 py-3 border border-gray-300/50 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-all duration-300'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700 mb-2 block'
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='w-full px-4 py-3 border border-gray-300/50 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-all duration-300'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              {isLoading ? (
                <>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className='text-center'>
              <div className='bg-blue-50/70 backdrop-blur-sm border border-blue-200 rounded-xl p-4'>
                <p className='text-sm text-blue-700 font-medium'>
                  Admin credentials:
                </p>
                <p className='text-xs text-blue-600 mt-1'>
                  admin@ecommerce.com / admin123
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
