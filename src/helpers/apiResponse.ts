import type { ApiResponse } from "@/types/response";

export const apiResponse = <T>({
  status = true,
  message = "",
  data,
}: {
  status?: boolean;
  message?: string;
  data?: T;
}): ApiResponse<T> => {
  return {
    status,
    message,
    data,
  };
};
