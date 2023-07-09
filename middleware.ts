import { NextResponse } from "next/server";
import nc from "next-connect";

import type { NextRequest } from "next/server";
import myMiddleware from "./mymiddleware";

//3S1unaM3ssagePubl1c
export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("token");
  if (!jwt) return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    // "/admin",
    "/admin/clients",
    "/admin/employees",
    "/admin/index",
    "/admin/listServices",
    "/admin/listServices/:path*",
    "/admin/newService",
    "/admin/changePassword",
    "/admin/changeRole",
    "/admin/createNewUser",
    "/employee/profile",
    "/employee/edit",
    "/employee/applications",
    "/employee/moreDetails",
    "/employee/changePassword",

    "/employee/:path*",
  ],
};
