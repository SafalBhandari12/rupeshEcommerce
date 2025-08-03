"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='max-w-md w-full text-center'>
          <div className='bg-green-50/70 backdrop-blur-md border border-green-200 text-green-600 px-6 py-4 rounded-2xl shadow-lg'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <p className='font-medium'>Account created successfully!</p>
            <p className='text-sm mt-1'>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24'>
      <div className='max-w-md w-full space-y-8'>
        <div className='bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-extrabold text-gray-900'>
              Create your account
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Or{" "}
              <Link
                href='/login'
                className='font-medium text-gray-900 hover:text-gray-700 transition-colors duration-300'
              >
                sign in to existing account
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
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Full Name
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  autoComplete='name'
                  className='w-full px-4 py-3 border border-gray-300/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300'
                  placeholder='Enter your full name'
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Email Address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='w-full px-4 py-3 border border-gray-300/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300'
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  required
                  className='w-full px-4 py-3 border border-gray-300/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300'
                  placeholder='Enter your password'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Confirm Password
                </label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  required
                  className='w-full px-4 py-3 border border-gray-300/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300'
                  placeholder='Confirm your password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
