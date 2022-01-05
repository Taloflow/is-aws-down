// Retrieves a string from the desired endpoint
// Treats non 200 response codes as a failure

type GetStringResp = {
  success: boolean;
  resp: string;
};

export const GetStringOrFail = async (
  endpoint: string
): Promise<GetStringResp> => {
  try {
    const result = await fetch(endpoint);
    if (!result.ok || result.status !== 200) {
      console.warn(result);
      return {
        resp: "",
        success: false,
      };
    }
    const readResult = (await result.json()) as string;
    return {
      resp: readResult,
      success: true,
    };
  } catch (e) {
    console.warn(e);
    return {
      resp: e,
      success: false,
    };
  }
};
