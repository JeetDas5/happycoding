import axios from "axios";

export async function checkHealthStatus(): Promise<number> {
  console.log("Checking server health...");
  console.log("Server URL:", process.env.NEXT_PUBLIC_APP_URL);
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/health`
    );
    console.log("Health check response:", response.data.status);
    return response.data.status;
  } catch (error) {
    console.error("Server is not healthy", error);
    return 500;
  }
}
