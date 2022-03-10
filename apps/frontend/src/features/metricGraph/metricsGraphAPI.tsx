import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "../../app/store";
import { selectMetricGraph } from "./metricGraphSlice";
import { MetricsData } from "./UptimeMetrics";
import { DataForChartJS, TransformDataForCache } from "./transformForChartJS";

// Pull requests welcome for making this function reusable
//
const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseURL = selectMetricGraph(api.getState() as RootState)
    .baseURL as string;
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
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    method: "GET",
  });
  return rawBaseQuery(args, api, extraOptions);

  // console.log("base URL is", baseURL);
  // const urlEnd = typeof args === "string" ? args : args.url;
  // // construct a dynamically generated portion of the url
  // const adjustedUrl = `/${urlEnd}`;
  // const adjustedArgs =
  //   typeof args === "string" ? adjustedUrl : { ...args, url: adjustedUrl };
  // // provide the amended url and other params to the raw base query
  // return rawBaseQuery(adjustedArgs, api, extraOptions);
};

export const metricsAPI = createApi({
  reducerPath: "metricsAPI",
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    getAllMetrics: builder.query<DataForChartJS[] | null, string>({
      query: (regionName) => `/metrics?region=${regionName}&groupby=minute`,
      transformResponse: (response) =>
        TransformDataForCache(response as MetricsData),
    }),
  }),
});

export const { useGetAllMetricsQuery } = metricsAPI;
