'use client';
import { useEffect, useState } from 'react';
import JobRow from '@/app/components/JobRow';

export default function JobSearchResults() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('search') : '';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/jobs-search?search=${searchQuery}`);
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchJobs();
    }
  }, [searchQuery]);

  return (
    <div className="container">
      <h1 className="text-3xl text-center my-4">Job Listings</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobRow key={job._id} jobDoc={job} />)
          ) : (
            <p>No jobs found for "{searchQuery}".</p>
          )}
        </div>
      )}
    </div>
  );
}
