'use client'; // This marks the component as a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import TimeAgo from '@/app/components/TimeAgo'; // Assuming you have this component for time formatting

export default function JobSearchResults() {
  const router = useRouter();
  const { search } = router.query; // Get the search query from the URL
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (search) {
      setLoading(true);

      const fetchJobs = async () => {
        try {
          const response = await fetch(`/api/jobs-search?search=${search}`);
          const data = await response.json();
          setJobs(data);  // Set the fetched jobs data
        } catch (error) {
          console.error('Error fetching jobs:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobs();
    } else {
      setLoading(false); // Stop loading if no search term
    }
  }, [search]);

  return (
    <div className="container">
      <h1 className="text-3xl text-center my-4">Job Listings</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="bg-white p-4 rounded-lg shadow-sm relative">
                <div className="absolute cursor-pointer top-4 right-4">
                  {/* Some Icon here */}
                </div>
                <div className="flex grow gap-4">
                  <div className="content-center w-12 basis-12 shrink-0">
                    <img className="size-12" src={job?.jobIcon} alt="Job Icon" />
                  </div>
                  <div className="grow sm:flex">
                    <div className="grow">
                      <div>
                        <Link href={`/jobs/${job.orgId}`} className="hover:underline text-gray-500 text-sm">
                          {job.orgName || '?'}
                        </Link>
                      </div>
                      <div className="font-bold text-lg mb-1">
                        <Link className="hover:underline" href={`/show/${job._id}`}>
                          {job.title}
                        </Link>
                      </div>
                      <div className="text-gray-400 text-sm capitalize">
                        {job.remote} {' '} &middot; {' '}
                        {job.city}, {job.country} {' '} &middot; {' '}
                        {job.type}-time
                      </div>
                    </div>
                    {job.createdAt && (
                      <div className="content-end text-gray-500 text-sm">
                        <TimeAgo createdAt={job.createdAt} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs found for "{search}".</p>
          )}
        </div>
      )}
    </div>
  );
}
