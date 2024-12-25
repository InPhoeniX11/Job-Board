import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default async function middleware(request: Request) {
  try {
    // This will check for the JWT validity
    return await authkitMiddleware()(request);
  } catch (error) {
    // If JWT is expired, redirect to login page
    if (error.code === 'ERR_JWT_EXPIRED') {
      // Redirect to login page
      return Response.redirect('/login', 302);
    }
    // For other errors, rethrow them
    throw error;
  }
}

// Matcher for specific routes
export const config = {
  matcher: [
    '/', 
    '/new-listing', 
    '/new-listing/:orgId*', 
    '/new-company', 
    '/jobs/:orgId*', 
    '/jobs/edit/:jobId*', 
    '/show/:jobId*', 
    '/jobs-search', // Ensure this route is included
  ],
};
