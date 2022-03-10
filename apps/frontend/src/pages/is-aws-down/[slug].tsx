import path from "path";
import fs from "fs";
import {
  FullPageProps,
  HealthCheckPage,
} from "../../components/fullPage/healthCheckPage";

export default function Page(props: FullPageProps) {
  return <HealthCheckPage {...props} />;
}

export async function getStaticProps({ params }) {
  let filePath = path.join(process.cwd(), "data", params.slug + ".json");
  const file = fs.readFileSync(filePath, "utf8");
  let asJson = await JSON.parse(file);
  return {
    props: asJson,
  };
}

export async function getStaticPaths() {
  let filePath = path.join("data");
  const files = fs.readdirSync(filePath);

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".json", ""),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}
