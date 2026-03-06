import { fetchIPData } from "./ipService.js";

export const checkIPRisk = async (ip) => {
  let risk = 0;
  let reasons = [];

  const data = await fetchIPData(ip);
  if (!data) return { risk: 0, reasons: [] };

  if (data?.privacy?.vpn) {
    risk += 40;
    reasons.push("VPN detected");
  }

  if (data?.privacy?.proxy) {
    risk += 40;
    reasons.push("Proxy detected");
  }

  if (data?.privacy?.tor) {
    risk += 60;
    reasons.push("TOR network detected");
  }

  if (
    data?.org &&
    /amazon|google|azure|digitalocean|hetzner/i.test(data.org)
  ) {
    risk += 30;
    reasons.push("Datacenter IP detected");
  }

  return { risk, reasons };
};
