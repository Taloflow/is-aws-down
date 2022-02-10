import { Navbar } from "../../components/healthCheckPageElements/navbar";
import { BlankNavbar } from "../../components/general/blankNavBar";
import { RegionCard } from "../../components/summaryPage/regionCard";

export default function Index() {
  const regions = [
    "us-west-2",
    "ap-south-1",
    "ap-southeast-2",
    "ca-central-1",
    "eu-west-1",
    "eu-west-2",
    "sa-east-1",
    "us-east-2",
    "us-east-1",
    "us-west-1",
  ];
  return (
    <div>
      <BlankNavbar />
      {regions.map((region) => {
        return (
          <div>
            <RegionCard key={region} RegionName={region} />
          </div>
        );
      })}
    </div>
  );
}
