import { NextResponse } from "next/server";
import nc from "next-connect";

import type { NextRequest } from "next/server";
import myMiddleware from "./mymiddleware";

//3S1unaM3ssagePubl1c
export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("token")?.value;
  // const jsonwt = localStorage.getItem("token");

  
  // const status = request.cookies.get("status")!.value;
  // const auth = request.cookies.get("auth")!.value;
  // console.log(status);
  // if (!status === undefined) {
  //   const responseUrl = NextResponse.redirect(new URL("/", request.url));
  //   return responseUrl;
  // }
  if (!jwt) {
    request.cookies.clear();
    request.cookies.set("employee", "");
    const responseUrl = NextResponse.redirect(new URL("/", request.url));
    responseUrl.cookies.set("employee", "");
    responseUrl.cookies.delete("employee");
    responseUrl.cookies.delete("auth");
    responseUrl.cookies.delete("token");
    responseUrl.cookies.delete("status");
    return responseUrl;
  }
}

export const config = {
  matcher: [
    // "/admin",
    // "/admin/clients",
    // "/admin/employees",
    // "/admin/index",
    // "/admin/listServices",
    // "/admin/listServices/:path*",
    // "/admin/newService",
    // "/admin/listUsers",
    // "/admin/infolist",
    // "/admin/historial",
    // "/admin/changePassword",
    // "/admin/changeRole",
    // "/admin/createNewUser",
    "/employee/profile",
    "/employee/edit",
    "/employee/applications",
    "/employee/moreDetails",
    "/employee/changePassword",
    "/employee/:path*",
  ],
};

