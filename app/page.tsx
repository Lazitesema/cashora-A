"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const LandingPage: React.FC = () => {
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Cashora</Link>
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="hover:text-green-500 transition-colors">Home</a>
            <a href="#about" className="hover:text-green-500 transition-colors">About Us</a>
            <a href="#services" className="hover:text-green-500 transition-colors">Services</a>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link href="/signin" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">Sign In</Link>
            <Link href="/signup" className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition-colors">Sign Up</Link>
          </div>
          <div className="md:hidden">
            {/* Hamburger Menu (Mobile) */}
            <button>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="container mx-auto py-16 px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Secure Your Financial Future with Cashora</h1>
          <p className="text-lg mb-6">Your trusted partner for expert financial and accounting services.</p>
          <Button className="bg-green-500 hover:bg-green-600 transition-colors">Get a Free Consultation</Button>
        </div>
        <div className="md:w-1/2">
          <Image src="/placeholder.jpg" alt="Accountant" width={600} height={400} className="rounded-lg shadow-lg" />
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="container mx-auto py-16 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">About Cashora</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="mb-4">At Cashora, we're dedicated to helping individuals and businesses achieve financial clarity and success. Our expert team of financial professionals provides tailored solutions to meet your unique needs.</p>
            <p>With years of experience and a commitment to excellence, we strive to be your trusted partner in managing your finances effectively.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image src="/placeholder.jpg" alt="Teamwork" width={300} height={200} className="rounded-lg" />
            <Image src="/placeholder.jpg" alt="Expertise" width={300} height={200} className="rounded-lg" />
            <Image src="/placeholder.jpg" alt="Success" width={300} height={200} className="rounded-lg" />
            <Image src="/placeholder.jpg" alt="Growth" width={300} height={200} className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-100 dark:bg-gray-800 py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              {/* Icon */}
              <h3 className="text-xl font-semibold mb-2">Financial Planning</h3>
              <p>Personalized financial plans to help you achieve your goals.</p>
            </div>
            {/* Service Card 2 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              {/* Icon */}
              <h3 className="text-xl font-semibold mb-2">Accounting Services</h3>
              <p>Comprehensive accounting solutions for businesses of all sizes.</p>
            </div>
            {/* Service Card 3 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              {/* Icon */}
              <h3 className="text-xl font-semibold mb-2">Tax Preparation</h3>
              <p>Expert tax preparation and filing services to maximize your returns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto py-16 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What services does Cashora offer?</AccordionTrigger>
            <AccordionContent>
              Cashora provides financial planning, accounting services, tax preparation, and more.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How can I get started with Cashora?</AccordionTrigger>
            <AccordionContent>
              You can start by signing up or requesting a free consultation on our website.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is Cashora suitable for small businesses?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer tailored services to meet the unique needs of small businesses.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="bg-green-500 py-16 px-4 md:px-8 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="mb-6">Sign up now and get started with Cashora today!</p>
          <Link href="/signup">
            <Button className="bg-white text-green-500 hover:bg-gray-100 transition-colors">Sign Up</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} Cashora. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            {/* Social Media Icons */}
          </div>
          <div>
            {/* Newsletter Form */}
            <form>
              <input type="email" placeholder="Enter your email" className="bg-gray-700 rounded-md px-3 py-2 text-white mr-2" />
              <Button className="bg-green-500 hover:bg-green-600">Subscribe</Button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;