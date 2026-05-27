import React from "react";
import { Card } from "@mui/material";
import { motion } from "framer-motion";
import { glassEffect } from "./SharedStyles";

const GlassCard = ({ children, sx = {}, hoverEffect = true }) => (
  <Card
    component={motion.div}
    whileHover={hoverEffect ? {
      translateY: -5,
      scale: 1.01,
      borderColor: "rgba(255, 255, 255, 0.2)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.1)"
    } : {}}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 150, damping: 20 }}
    sx={{
      ...glassEffect,
      background: "rgba(255, 255, 255, 0.25)",
      border: "1px solid rgba(255, 255, 255, 0.45)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
      color: "#0f172a",
      overflow: "hidden",
      ...sx,
    }}
  >
    {children}
  </Card>
);

export default GlassCard;
