'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to the new job search route with the search term as a query parameter
      router.push(`/jobs-search?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      alert('Please enter a search term.');
    }
  };

  return (
    <section className="container my-16">
      <h1 className="text-4xl font-bold text-center">
        Find your next<br />dream job
      </h1>
      <form onSubmit={handleSearch} className="flex gap-2 mt-4 max-w-md mx-auto">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-400 w-full py-2 px-3 rounded-md"
          placeholder="Search for jobs..."
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">
          Search
        </button>
      </form>
    </section>
  );
}
