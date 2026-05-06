import axios from "axios";

export async function checkHealthStatus(): Promise<number> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/health`
    );
    return response.data.status;
  } catch (error) {
    console.error("Server is not healthy", error);
    return 500;
  }
}
