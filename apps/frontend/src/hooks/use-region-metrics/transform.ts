import { RegionMetrics } from "./types";

export type RegionChartMetric = {
  totalNumberOfChecks: number;
  numberOfOutagesSummary: number;
  label: string;
  data: number[];
  timeStampsOfFailures: string[] | null; // Human readable list of failed checks
  uniqueColor: string;
  backgroundColor: string[];
  borderColor: string;
  labels?: string[];
};

// Takes in the API data and transforms it into something easier to work with.
// It's done before it hits the cache for performance reasons
export const transformData = (
  metrics: RegionMetrics
): RegionChartMetric[] | null => {
  try {
    // Make sure the data isn't null
    if (!metrics || !metrics.summary) {
      console.warn("no response data");
      return null;
    }
    let chart = [] as RegionChartMetric[];
    for (const [key, value] of Object.entries(metrics.series)) {
      // Get colors for the button depending on the key
      let colors = getColors(key);
      if (!metrics.summary[0] || !metrics.summary[0][key]) {
        console.warn("missing summary for", key);
        console.warn("missing summary for", key);
        continue;
      }

      chart.push({
        timeStampsOfFailures: getTimeStampsOfFailures(value),
        totalNumberOfChecks:
          metrics.summary[0][key].down + metrics.summary[0][key].up,
        // Store data as 0% or percent of health checks failed
        numberOfOutagesSummary: getOutageCount(value),
        uniqueColor: colors.backgroundColor,
        backgroundColor: getBGColors(value),
        borderColor: colors.borderColor,
        label: key,
        data: getMetrics(value),
        labels: createLabels(value),
      });
    }

    // Sort the data so the most problematic services are in the front
    chart.sort((a, b) => {
      if (a.numberOfOutagesSummary > b.numberOfOutagesSummary) {
        return -1;
      }
      if (a.numberOfOutagesSummary < b.numberOfOutagesSummary) {
        return 1;
      }
      if (a.label > b.label) {
        return 1;
      }
      if (b.label > a.label) {
        return -1;
      }
      return 0;
    });
    chart = [createSummaryItem(chart), ...chart];
    return chart;
  } catch (e) {
    console.warn("failed to transform to chart readable format", e);
  }
};

const getOutageCount = (s: UpDown[]) => {
  let outages = 0;
  s.map((dataPoint) => {
    if (dataPoint.down > 0) {
      outages++;
    }
  });
  return outages;
};

const getTimeStampsOfFailures = (s: UpDown[]) => {
  let timeStamps = [] as string[];
  s.forEach((datum) => {
    if (datum.down === 0) {
      return;
    }
    let labelDate = new Date(datum.timestamp);
    timeStamps.push(labelDate.toLocaleTimeString("en-US"));
  });
  return timeStamps;
};

const getColors = (key: string) => {
  switch (key) {
    case "SQS":
      return {
        backgroundColor: "#FCBF64",
        borderColor: "#FCBF64",
      };
    case "DynamoDB":
      return {
        backgroundColor: "#64D7FC",
        borderColor: "#64D7FC",
      };
    case "API Gateway":
      return {
        backgroundColor: "#6473FC",
        borderColor: "#6473FC",
      };
    case "Lambda":
      return {
        backgroundColor: "#9E64FC",
        borderColor: "#9E64FC",
      };
    case "S3":
      return {
        backgroundColor: "#FC64AD",
        borderColor: "#FC64AD",
      };
    case "EC2":
      return {
        backgroundColor: "#FC9164",
        borderColor: "#FC9164",
      };
    default:
      return {
        backgroundColor: "#FC9164",
        borderColor: "#FC9164",
      };
  }
};

interface UpDown {
  up: number;
  down: number;
  timestamp: string;
}

const getMetrics = (upDownMetrics: UpDown[]): number[] => {
  let numberArr = [] as number[];
  if (!upDownMetrics) {
    console.warn("up down metrics was null");
    return [0];
  }

  upDownMetrics.map((metric) => {
    // helps us ensure the data graph works
    if (window?.location?.href.includes("debug-data")) {
      metric.down = metric.down + Math.floor(Math.random() * 30);
      numberArr.push(metric.down / metric.up);
    } else {
      if (metric.down > 0) {
        numberArr.push(-1);
      } else {
        numberArr.push(1);
      }
    }
  });
  return numberArr;
};

const createLabels = (series: UpDown[]): string[] => {
  let labels = [] as string[];
  series.map((dataPoint) => {
    try {
      let labelDate = new Date(dataPoint.timestamp);
      labels.push(labelDate.toLocaleTimeString("en-US"));
    } catch (e) {
      console.warn(e);
      return;
    }
  });
  return labels;
};

const getBGColors = (series: UpDown[]): string[] => {
  let colors = [] as string[];
  series.map((dataPoint) => {
    dataPoint.down > 0 ? colors.push("red") : colors.push("green");
  });
  return colors;
};

// Create an "all" view that has all of the failures
// This is a Quick and dirty implementation that has the following problems:
// 1. We redo a lot of calculations
// 2. We can't guarantee that each individual MetricsChart[] has the same number of health checks
// This might be a problem, but we'll assume it isn't for now based on how the front end handles the
// SQL query (it doesn't _need_ a health check with a timeframe to return a value)
// Although if this is true, it shows that we're computing labels when we don't have to on each
// object. Either way, not a problem to solve right now
const createSummaryItem = (Items: MetricsChart[]): MetricsChart | null => {
  if (!Items[0]) {
    console.warn("issue when creating combined data object, no items present");
    return;
  }
  let data = [] as UpDown[];
  Items.forEach((dataObject, dataObjectIndex) => {
    // if there are any -1 values, make sure the summary object has a -1 value
    dataObject.data.map((datum, index) => {
      if (datum === -1) {
        data[index] = {
          up: 0,
          down: 1,
          timestamp: "", // Don't need the time stamp here, we just borrow a
        };
      }
      // Only add positives on the first pass through the data
      if (datum === 1 && dataObjectIndex === 0) {
        data[index] = {
          up: 1,
          down: 0,
          timestamp: "",
        };
      }
    });
  });

  return {
    label: "All",
    timeStampsOfFailures: null,
    // Don't add this number to the total number of checks
    totalNumberOfChecks: 0,
    // Store data as 0% or percent of health checks failed
    numberOfOutagesSummary: getOutageCount(data),
    borderColor: "#3FC4E1",
    uniqueColor: "#3FC4E1",
    backgroundColor: getBGColors(data),
    data: getMetrics(data),
    labels: Items[0].labels,
  } as MetricsChart;
};
