import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "../../app/store";
import { QuestionFromEndpoint, selectVotingGame } from "./votingGameSlice";

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseURL = selectVotingGame(api.getState() as RootState).baseURL;
  // gracefully handle scenarios where data to generate the URL is missing
  if (baseURL === "") {
    console.warn("no base URL");
    return {
      error: {
        status: 400,
        statusText: "Bad Request",
        data: "No base URL",
      },
    };
  }
  const urlEnd = typeof args === "string" ? args : args.url;
  // construct a dynamically generated portion of the url
  const adjustedUrl = `/${urlEnd}`;
  const adjustedArgs =
    typeof args === "string" ? adjustedUrl : { ...args, url: adjustedUrl };
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    method: "GET",
  });
  // provide the amended url and other params to the raw base query
  return rawBaseQuery(adjustedArgs, api, extraOptions);
};

export const votingGameAPI = createApi({
  reducerPath: "votingGameAPI",
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    getAllQuestions: builder.query<QuestionFromEndpoint[], string>({
      query: () => `topics?include_votes=true`,
    }),
  }),
});

export const { useGetAllQuestionsQuery } = votingGameAPI;
