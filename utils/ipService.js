import axios from "axios";

export const fetchIPData = async (ip) => {
  try {
    const response = await axios.get(
      `https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("IPINFO error:", error.message);
    return null;
  }
};
