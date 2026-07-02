import { alpha } from "@mui/material";

export const PRIMARY_BG = "#ffffff";
export const SECONDARY_BG = "#f8fafc";
export const TERTIARY_BG = "#f1f5f9";
export const HR_NAVY = "#0f4c81";
export const GLASS_BORDER = "rgba(255, 255, 255, 0.45)";

export const glassEffect = {
  background: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(30px) saturate(160%)",
  border: "1px solid rgba(255, 255, 255, 0.45)",
  borderRadius: "22px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.5)",
  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  position: "relative",
};

export const iPhoneGlassButton = {
  background: "rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.45)",
  borderRadius: "16px",
  color: "rgba(0, 0, 0, 0.8)",
  fontWeight: 1000,
  textTransform: "none",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.45)",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  }
};

export const whiteCard = {
  background: "#ffffff",
  borderRadius: "20px",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
  }
};

export const premiumStatCard = {
  background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
  borderRadius: "16px",
  color: "#ffffff",
  position: "relative",
  overflow: "hidden",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "100px",
  width: "100%",
  flexGrow: 1,
  boxShadow: "0 10px 25px rgba(30, 58, 138, 0.2)",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: "-20%",
    left: "-10%",
    width: "140px",
    height: "140px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "100px",
    height: "100px",
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "50%",
    pointerEvents: "none",
  }
};

export const POSTS = ["admin", "head", "superadmin"];
export const DEPARTMENTS = [
  "IT",
  "DM",
  "Editing",
  "Content-writing",
  "Video-production",
  "Graphic Design",
  "Accounts",
  "Sales"
];

export const normalizeDeptName = (dept) => {
  if (!dept || dept.length > 15) return dept || "Unknown";
  if (dept === "DM") return "Digital marketing";
  if (dept === "IT") return "information technology";
  if (dept === "Editing") return "videos-editing";
  if (dept === "Video-production") return "Video-production";
  if (dept === "Content-writing") return "Content-writing";
  if (dept === "Graphic Design") return "graphic-design";
  if (dept === "Accounts") return "Accounts";
  if (dept === "Sales") return "Sales";
  return dept;
};

export const getDeptColor = (dept) => {
  switch (dept) {
    case "Digital marketing": return "#f472b6";
    case "information technology": return "#38bdf8";
    case "videos-editing": return "#a78bfa";
    case "Content-writing": return "#34d399";
    case "Video-production": return "#fb7185";
    case "graphic-design": return "#facc15";
    case "Accounts": return "#60a5fa";
    case "Sales": return "#fb923c";
    default: return "#94a3b8";
  }
};
