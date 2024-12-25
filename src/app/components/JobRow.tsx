'use client';
import TimeAgo from "@/app/components/TimeAgo";
import { Job } from "@/models/Job";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function JobRow({ jobDoc }: { jobDoc: Job }) {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [loadingOrgName, setLoadingOrgName] = useState<boolean>(true);

  useEffect(() => {
    // If orgName is already available from the jobDoc, use it
    if (jobDoc.orgName) {
      setOrgName(jobDoc.orgName);
      setLoadingOrgName(false);
    } else {
      // Simulate async fetching logic for orgName (replace with actual fetch)
      setTimeout(async () => {
        try {
          // Replace with your actual API call to fetch organization name based on orgId
          const response = await axios.get(`/api/org/${jobDoc.orgId}`);
          const fetchedOrgName = response.data.name;  // Assuming the response has a `name` field
          setOrgName(fetchedOrgName);
        } catch (error) {
          console.error("Error fetching organization name", error);
          setOrgName("Unknown Organization");
        } finally {
          setLoadingOrgName(false);
        }
      }, 500); // Simulate delay in fetching
    }
  }, [jobDoc]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm relative">
      <div className="absolute cursor-pointer top-4 right-4">
        <FontAwesomeIcon className="w-4 h-4 text-gray-300" icon={faHeart} />
      </div>
      <div className="flex grow gap-4">
        <div className="content-center w-12 basis-12 shrink-0">
          <img className="size-12" src={jobDoc?.jobIcon} alt="Job Icon" />
        </div>
        <div className="grow sm:flex">
          <div className="grow">
            <div>
              <Link href={`/jobs/${jobDoc.orgId}`} className="hover:underline text-gray-500 text-sm">
                {loadingOrgName ? "Loading..." : orgName}  {/* Show loading or org name */}
              </Link>
            </div>
            <div className="font-bold text-lg mb-1">
              <Link className="hover:underline" href={`/show/${jobDoc._id}`}>
                {jobDoc.title}
              </Link>
            </div>
            <div className="text-gray-400 text-sm capitalize">
              {jobDoc.remote}
              {" "}&middot;{" "}
              {jobDoc.city}, {jobDoc.country}
              {" "}&middot;{" "}
              {jobDoc.type}-time
              {jobDoc.isAdmin && (
                <>
                  {" "}&middot;{" "}
                  <Link href={`/jobs/edit/${jobDoc._id}`}>Edit</Link>
                  {" "}&middot;{" "}
                  <button
                    type="button"
                    onClick={async () => {
                      await axios.delete(`/api/jobs?id=${jobDoc._id}`);
                      window.location.reload();
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
          {jobDoc.createdAt && (
            <div className="content-end text-gray-500 text-sm">
              <TimeAgo createdAt={jobDoc.createdAt} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
