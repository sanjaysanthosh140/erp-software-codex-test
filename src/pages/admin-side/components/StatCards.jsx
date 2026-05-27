import React from "react";
import { Grid, Box, Typography, Zoom } from "@mui/material";
import { premiumStatCard } from "./SharedStyles";

const StatCard = ({ title, value, icon: Icon }) => (
  <Box sx={premiumStatCard}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <Icon sx={{ fontSize: "1.6rem", opacity: 0.9 }} />
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "1rem",
        }}
      >
        {title}
      </Typography>
    </Box>
    <Box>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          color: "#ffffff",
          fontSize: { xs: "2rem", md: "2.5rem" },
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const StatCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 6, position: "relative", zIndex: 1, width: "100%", justifyContent: "space-between" }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: "flex", flexGrow: 1 }}>
          <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
            <Box sx={{ width: "100%", display: "flex", flexGrow: 1 }}>
              <StatCard {...stat} />
            </Box>
          </Zoom>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
