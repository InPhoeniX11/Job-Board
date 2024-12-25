// src/app/api/jobs-search/route.ts
import { JobModel } from "@/models/Job";
import { WorkOS } from "@workos-inc/node";
import { NextResponse } from "next/server";

const workos = new WorkOS(process.env.WORKOS_API_KEY as string);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";

    // Fetch jobs from MongoDB
    const jobs = await JobModel.find({
      title: { $regex: search, $options: "i" }, // Match jobs based on the search term
    });

    // Add organization names to each job
    const jobsWithOrgNames = await Promise.all(
      jobs.map(async (job) => {
        try {
          const org = await workos.organizations.getOrganization(job.orgId);
          return { ...job.toObject(), orgName: org?.name || "Unknown Organization" };
        } catch (error) {
          console.error(`Failed to fetch organization for job ${job._id}:`, error);
          return { ...job.toObject(), orgName: "Unknown Organization" };
        }
      })
    );

    return NextResponse.json(jobsWithOrgNames);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.error();
  }
}
