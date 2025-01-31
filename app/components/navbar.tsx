import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-around items-center">
      <Link href="/" className="hover:text-gray-300">
        Home
      </Link>
      <Link href="/signin" className="hover:text-gray-300">
        Sign In
      </Link>
      <Link href="/signup" className="hover:text-gray-300">
        Sign Up
      </Link>
    </div>
  );
}