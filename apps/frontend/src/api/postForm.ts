import { ErrorMessage } from "../types";

export const postForm = async (path: string, data: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "*",
    },
    body: data,
  });
  let responseJSON = await response.json();
  if ([400, 401, 402, 403, 500].includes(response.status)) {
    return {
      isOk: false,
      responseMessage: responseJSON as ErrorMessage,
    };
  }
  return {
    isOk: response.ok,
    responseMessage: responseJSON,
  };
};
