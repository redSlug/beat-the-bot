import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware for handling CORS
export function middleware(request: NextRequest) {
  // Define allowed origins
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://beat-the-bot.vercel.app",
  ];

  // Get the origin from the request headers
  const origin = request.headers.get("origin") || "";

  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Create a new response with the current response
  const response = NextResponse.next();

  // Set CORS headers on the response
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Only set Access-Control-Allow-Origin if origin is allowed
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

// Configure the middleware to run only for API routes
export const config = {
  matcher: "/api/:path*",
};
