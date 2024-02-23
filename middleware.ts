import { NextResponse } from "next/server";
import nc from "next-connect";

import type { NextRequest } from "next/server";
import myMiddleware from "./mymiddleware";

//3S1unaM3ssagePubl1c
export async function middleware(request: NextRequest) {
    const jwt = request.cookies.get("token");
  const status = request.cookies.get("status")!;
  console.log(status);
  if (!status === undefined) {
    const responseUrl = NextResponse.redirect(new URL("/", request.url));
    return responseUrl;
  }
  if (!jwt || !JSON.stringify(status.value)) {
    request.cookies.clear();
    request.cookies.set("employee", "");
    const responseUrl = NextResponse.redirect(new URL("/", request.url));
    responseUrl.cookies.set("employee", "");
    responseUrl.cookies.delete("employee");
    responseUrl.cookies.delete("token");
    responseUrl.cookies.delete("status");

    return responseUrl;
  }
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
