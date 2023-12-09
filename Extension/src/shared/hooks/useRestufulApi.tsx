import { useState } from "react";
import getHostName from "../utils/getHostName";
import TokenStorage from "../services/TokenStorage.service";
import { ErrorMessage } from "../types/useRestfulApi.types";

import { z } from "zod";
import { ErrorSchema } from "../../models/ErrorModel";

const hostName = getHostName();

const useRestfulApi = () => {
  const [error, setError] = useState<ErrorMessage | null>(null);
  const sendReq = async <T extends z.Schema>(
    url: string,
    method: string,
    body: string | null | FormData,
    schema: T
  ): Promise<z.infer<T> | z.infer<typeof ErrorSchema>> => {
    try {

      const authorization = await TokenStorage.isAuthenticated()
      ? await TokenStorage.getAuthenticationHeader()
      : null;
    
      let header = {};
      if (!(body instanceof FormData))
        header = { "Content-type": "application/json; charset=UTF-8" };

      const response = await fetch(`${hostName}${url}`, {
        method: method,
        body: body ? body : null,
        headers: {
          ...header,
          Authorization: `${authorization?.tabLock}`,
          mode: "cors",
        },
      });
   
      type error = z.infer<typeof ErrorSchema>;

      type schemaData = z.infer<typeof schema>;

      type dataType = Promise<schemaData | error>;

      const data: dataType = (await response.json()) as dataType;

      const parsedData = schema.safeParse(data);
        
      if (parsedData.success) {
        return data;
      } else {
        const errorParsed = ErrorSchema.safeParse(data);
        if (errorParsed.success) {
          return data;
        }
      }
    } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e);
        }
    }
  };

  
  return { error, sendReq };
};

export default useRestfulApi;
