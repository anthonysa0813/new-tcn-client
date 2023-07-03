import { LINK_BACKEND } from "../utils/constanstApi";

// export const getLinkToCv = (link: string = "", withoutSlice: boolean) => {
//   const cleanLink = withoutSlice ? link.slice(5) : link;
//   return `${LINK_BACKEND}${cleanLink}`;
// };

export const getLinkToCv = (link: string = "", withoutSlice?: boolean) => {
  // const cleanLink = withoutSlice ? link.slice(5) : link;
  const [_, separateLink] = link.split("/contactbpo-server-main");
  return `${LINK_BACKEND}${separateLink}`;
};
