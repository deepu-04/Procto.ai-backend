import { checkIPRisk } from "../utils/riskEngine.js";

export const ipRiskMiddleware = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const { risk, reasons } = await checkIPRisk(ip);

    req.ipRisk = {
      ip,
      risk,
      reasons,
      level:
        risk >= 70 ? "HIGH" :
        risk >= 40 ? "MEDIUM" :
        "LOW",
    };

    next();
  } catch (error) {
    console.error("IP Risk Middleware Error:", error.message);

    req.ipRisk = {
      ip: "unknown",
      risk: 0,
      reasons: [],
      level: "LOW",
    };

    next();
  }
};
