const BASE_URL = `https://gcp-dashboard-generator.taloflow.ai`

export type LocationSummary = {
    region: string;
    "1h": ServicesAffected;
    "24h": ServicesAffected;
  }
  
export type ServicesAffected = {
    up: number;
    down: number;
    services_affected: string[];
}

export const fetchAWSOverview = async () => {
    try {
        const response = await fetch(`${BASE_URL}/overview`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        if (response.ok) {
            const data = await response.json()
            return data as LocationSummary[]
        }
        return []
    } catch (err) {
        console.error(err)
        return []
    }
}