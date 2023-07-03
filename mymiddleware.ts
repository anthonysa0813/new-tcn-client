import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

function myMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  const isReload = req.query.isReload === "true";

  if (isReload) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  next();
}

export default myMiddleware;
