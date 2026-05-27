/**
 * Landing Page — Glass Mirror UI Design System
 * Follows: edge_mirror.md + ui_design.md
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  alpha,
  Stack,
  useTheme,
  Chip,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Bolt as BoltIcon,
  ArrowForward as ArrowForwardIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  AutoAwesome as MagicIcon,
  Groups as TeamIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

/* ─── Design Tokens (Glass Mirror System) ─── */
const BG_WHITE = "#ffffff";
const BG_SOFT = "#f5f7fa";
const BG_EEF = "#eef1f5";
const TEXT_PRIMARY = "#1a1a1a";
const TEXT_SECONDARY = "#6b7280";
const GLASS_SURFACE = "rgba(255,255,255,0.6)";
const GLASS_BORDER = "rgba(255,255,255,0.8)";
const GLASS_BORDER_DARK = "rgba(10,15,25,0.07)";
const METALLIC = "#c0c0c0";
const ACCENT = "#4f46e5";

/* ─── Keyframe & Helper Styles ─── */
const glassSx = {
  background: GLASS_SURFACE,
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  border: `1px solid ${GLASS_BORDER}`,
  borderRadius: "24px",
  boxShadow:
    "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.04)",
};

const mirrorEdge = {
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    padding: "1px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(192,192,192,0.4) 50%, rgba(255,255,255,0.9) 100%)",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
  },
};

/* ─── Inject marquee keyframes once ─── */
const MarqueeStyle = () => (
  <style>{`
    @keyframes marqueeSlide {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      display: flex;
      width: max-content;
      animation: marqueeSlide 40s linear infinite;
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }
  `}</style>
);

/* ─── FadeIn motion wrapper ─── */
const FadeIn = ({ children, delay = 0, y = 24 }) => (
  <motion.div
    initial={{ opacity: 0, y, scale: 0.97 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ type: "spring", stiffness: 140, damping: 22, delay }}
  >
    {children}
  </motion.div>
);

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
};

/* ─── Glass Card ─── */
const GlassCard = ({ icon: Icon, title, description, delay = 0, color = ACCENT }) => (
  <FadeIn delay={delay}>
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Box
        sx={{
          ...glassSx,
          ...mirrorEdge,
          p: 4,
          height: "100%",
          cursor: "default",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.05)",
          },
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${alpha(color, 0.12)} 0%, ${alpha(color, 0.06)} 100%)`,
            border: `1px solid ${alpha(color, 0.15)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
            boxShadow: `0 4px 12px ${alpha(color, 0.1)}`,
          }}
        >
          <Icon sx={{ color: color, fontSize: 26 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: TEXT_PRIMARY, mb: 1, letterSpacing: -0.3 }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: TEXT_SECONDARY, lineHeight: 1.75, fontWeight: 500 }}>
          {description}
        </Typography>
      </Box>
    </motion.div>
  </FadeIn>
);

/* ─── Navbar ─── */
const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        bgcolor: scrolled ? "rgba(255,255,255,0.75)" : "transparent",
        backdropFilter: scrolled ? "blur(40px) saturate(200%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(40px) saturate(200%)" : "none",
        borderBottom: scrolled ? `1px solid ${GLASS_BORDER_DARK}` : "none",
        boxShadow: scrolled
          ? "0 1px 0 rgba(255,255,255,0.8), 0 4px 20px rgba(0,0,0,0.04)"
          : "none",
        py: scrolled ? 1.5 : 2.5,
      }}
    >
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* Logo */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <BoltIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                letterSpacing: -0.5,
                color: TEXT_PRIMARY,
                fontSize: "1.1rem",
              }}
            >
              Project Management Alkor
            </Typography>
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Login button — glass pill style */}
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                color: TEXT_PRIMARY,
                fontWeight: 800,
                fontSize: "0.85rem",
                textTransform: "none",
                letterSpacing: 0.3,
                borderRadius: "14px",
                px: 3,
                py: 1,
                border: `1.5px solid ${GLASS_BORDER_DARK}`,
                background: GLASS_SURFACE,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                transition: "all 0.25s ease",
                display: { xs: "none", sm: "flex" },
                "&:hover": {
                  border: `1.5px solid ${alpha(ACCENT, 0.25)}`,
                  background: "rgba(255,255,255,0.85)",
                  boxShadow:
                    "0 6px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Login
            </Button>


          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

/* ─── Main Landing ─── */
const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TeamIcon,
      title: "Team Orchestration",
      description:
        "Coordinate cross-functional teams with clarity. Assign roles, track progress, and keep everyone aligned — all in one place.",
      color: "#4f46e5",
    },
    {
      icon: TrendingUpIcon,
      title: "Real-Time Analytics",
      description:
        "Track project velocity, completion rates, and bottlenecks with live dashboards that turn data into decisions.",
      color: "#0891b2",
    },
    {
      icon: SecurityIcon,
      title: "Enterprise Security",
      description:
        "Role-based access control, audit trails, and encrypted data ensure your project intelligence stays protected.",
      color: "#059669",
    },
    {
      icon: SpeedIcon,
      title: "Performance Driven",
      description:
        "Built for speed. Lightweight interfaces and optimized workflows keep your team moving without friction.",
      color: "#d97706",
    },
    {
      icon: MagicIcon,
      title: "Smart Automation",
      description:
        "Automate routine updates, deadline reminders, and task assignments so your team focuses on what matters.",
      color: "#7c3aed",
    },
    {
      icon: CheckCircleIcon,
      title: "Milestone Tracking",
      description:
        "Define, track and celebrate milestones. Keep projects on-schedule and stakeholders always informed.",
      color: "#db2777",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: BG_WHITE,
        minHeight: "100vh",
        color: TEXT_PRIMARY,
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Soft Background ── */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* radial light 1 */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-5%",
            left: "15%",
            width: "55vw",
            height: "55vw",
            background:
              "radial-gradient(circle, rgba(79,70,229,0.06) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* radial light 2 */}
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "5%",
            right: "8%",
            width: "45vw",
            height: "45vw",
            background:
              "radial-gradient(circle, rgba(8,145,178,0.05) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(100px)",
          }}
        />
        {/* subtle grid texture */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.035) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.6,
          }}
        />
      </Box>

      <Navbar />

      {/* ── Hero Section ── */}
      <Container
        maxWidth="lg"
        sx={{ pt: { xs: 18, md: 26 }, pb: { xs: 10, md: 16 }, position: "relative", zIndex: 2 }}
      >
        <Stack alignItems="center" spacing={3} textAlign="center">
          <FadeIn>
            <Chip
              label="✦ Enterprise Project Management Platform"
              sx={{
                background: alpha(ACCENT, 0.06),
                color: ACCENT,
                border: `1px solid ${alpha(ACCENT, 0.12)}`,
                fontWeight: 800,
                fontSize: "0.7rem",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                py: 2,
                mb: 1,
                borderRadius: "20px",
              }}
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.8rem", md: "5.5rem" },
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: TEXT_PRIMARY,
              }}
            >
              Manage Your Projects
              <br />
              <motion.span
                style={{
                  display: "inline-block",
                  background:
                    "linear-gradient(135deg, #1a1a1a 0%, #4f46e5 45%, #0891b2 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                animate={{ backgroundPosition: ["0% center", "200% center"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                seamlessly
              </motion.span>
            </Typography>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Typography
              variant="h5"
              sx={{
                color: TEXT_SECONDARY,
                maxWidth: 680,
                lineHeight: 1.65,
                fontSize: { xs: "1.05rem", md: "1.3rem" },
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              A comprehensive platform for engineering teams. Orchestrate
              projects, automate workflows, and improve team productivity.
            </Typography>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
              {/* Primary CTA — dark glass pill */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #374151 100%)",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: 800,
                    px: 5,
                    py: 1.8,
                    borderRadius: "18px",
                    textTransform: "none",
                    letterSpacing: 0.2,
                    boxShadow:
                      "0 12px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
                      boxShadow:
                        "0 18px 44px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Login
                </Button>
              </motion.div>


            </Stack>
          </FadeIn>
        </Stack>
      </Container>



      {/* ── Stats Section ── */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          background: `linear-gradient(180deg, ${BG_WHITE} 0%, ${BG_SOFT} 100%)`,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Container maxWidth="lg">
          <FadeIn>
            <Typography
              align="center"
              sx={{
                color: TEXT_SECONDARY,
                fontSize: "0.75rem",
                fontWeight: 900,
                letterSpacing: 5,
                textTransform: "uppercase",
                mb: 8,
              }}
            >
              Platform at a Glance
            </Typography>
          </FadeIn>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            {[
              { val: 12500, label: "Active Users", suffix: "+" },
              { val: 640, label: "Teams Onboarded", suffix: "" },
              { val: 99, label: "System Uptime", suffix: ".99%" },
              { val: 3800, label: "Projects Delivered", suffix: "+" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <Box
                  sx={{
                    ...glassSx,
                    ...mirrorEdge,
                    textAlign: "center",
                    px: 5,
                    py: 4,
                    minWidth: 180,
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      boxShadow:
                        "0 16px 48px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      mb: 0.5,
                      background: `linear-gradient(135deg, ${TEXT_PRIMARY} 0%, ${ACCENT} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    <AnimatedCounter target={stat.val} suffix={stat.suffix} />
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: TEXT_SECONDARY,
                      fontWeight: 800,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </FadeIn>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── Features Section ── */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          background: BG_EEF,
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <MarqueeStyle />

        {/* Heading — centred, fixed size */}
        <Container maxWidth="lg">
          <FadeIn>
            <Stack alignItems="center" spacing={1.5} sx={{ mb: 8, textAlign: "center" }}>
              <Typography
                sx={{
                  color: TEXT_SECONDARY,
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  letterSpacing: 5,
                  textTransform: "uppercase",
                }}
              >
                Core Capabilities
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: TEXT_PRIMARY,
                  letterSpacing: "-0.03em",
                  maxWidth: 560,
                }}
              >
                Everything Your Team Needs
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: TEXT_SECONDARY, maxWidth: 540, lineHeight: 1.7 }}
              >
                A unified workspace designed to keep projects on track, teams
                aligned, and stakeholders informed — from kickoff to delivery.
              </Typography>
            </Stack>
          </FadeIn>
        </Container>

        {/* Fade masks on left & right */}
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 120,
              height: "100%",
              background: `linear-gradient(to right, ${BG_EEF}, transparent)`,
              zIndex: 3,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 120,
              height: "100%",
              background: `linear-gradient(to left, ${BG_EEF}, transparent)`,
              zIndex: 3,
              pointerEvents: "none",
            }}
          />

          {/* Infinite marquee track — cards + duplicate for seamless loop */}
          <Box
            sx={{
              overflow: "hidden",
              px: 0,
              py: 2,
            }}
          >
            <Box className="marquee-track">
              {[...features, ...features].map((f, i) => {
                const Icon = f.icon;
                return (
                  <Box
                    key={i}
                    sx={{
                      flexShrink: 0,
                      width: { xs: 280, md: 320 },
                      mx: 1.5,
                    }}
                  >
                    <motion.div
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Box
                        sx={{
                          ...glassSx,
                          ...mirrorEdge,
                          p: 4,
                          height: 240,
                          cursor: "default",
                          transition: "box-shadow 0.3s ease",
                          "&:hover": {
                            boxShadow:
                              "0 20px 60px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.95)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "14px",
                            background: `linear-gradient(135deg, ${alpha(f.color, 0.12)} 0%, ${alpha(f.color, 0.06)} 100%)`,
                            border: `1px solid ${alpha(f.color, 0.15)}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                            boxShadow: `0 4px 12px ${alpha(f.color, 0.1)}`,
                          }}
                        >
                          <Icon sx={{ color: f.color, fontSize: 24 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: TEXT_PRIMARY,
                            mb: 1,
                            letterSpacing: -0.3,
                            fontSize: "1rem",
                          }}
                        >
                          {f.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: TEXT_SECONDARY,
                            lineHeight: 1.7,
                            fontWeight: 500,
                            fontSize: "0.85rem",
                          }}
                        >
                          {f.description}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── CTA Section ── */}
      <Container maxWidth="md" sx={{ py: { xs: 12, md: 20 }, position: "relative", zIndex: 2 }}>
        <FadeIn>
          <Box
            sx={{
              ...mirrorEdge,
              position: "relative",
              p: { xs: 6, md: 12 },
              borderRadius: "48px",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #1a1a1a 0%, #2d3748 50%, #1a1a1a 100%)",
              border: `1px solid rgba(255,255,255,0.1)`,
              boxShadow: "0 64px 128px -32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Glow blobs */}
            <Box
              sx={{
                position: "absolute",
                top: "-15%",
                left: "-10%",
                width: "50%",
                height: "50%",
                background:
                  "radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)",
                filter: "blur(60px)",
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "-15%",
                right: "-10%",
                width: "50%",
                height: "50%",
                background:
                  "radial-gradient(circle, rgba(8,145,178,0.15) 0%, transparent 70%)",
                filter: "blur(60px)",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: 3,
                  letterSpacing: "-0.04em",
                  color: "#fff",
                  fontSize: { xs: "2rem", md: "3rem" },
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: alpha("#fff", 0.65),
                  mb: 7,
                  maxWidth: 520,
                  mx: "auto",
                  lineHeight: 1.65,
                  fontWeight: 500,
                  fontSize: "1.05rem",
                }}
              >
                Join the teams streamlining their projects
                with clarity and precision on Project Management Alkor.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/login")}
                    sx={{
                      bgcolor: "#fff",
                      color: TEXT_PRIMARY,
                      fontSize: "1rem",
                      fontWeight: 900,
                      px: 7,
                      py: 2,
                      borderRadius: "20px",
                      textTransform: "none",
                      letterSpacing: 0.2,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                      "&:hover": {
                        bgcolor: "#f5f7fa",
                        boxShadow: "0 24px 50px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Stack>
            </Box>
          </Box>
        </FadeIn>
      </Container>

      {/* ── Footer ── */}
      <Box
        sx={{
          borderTop: `1px solid ${GLASS_BORDER_DARK}`,
          py: 10,
          background: "rgba(245,247,250,0.5)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} justifyContent="space-between">
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "11px",
                    background: "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 6px 16px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <BoltIcon sx={{ color: "#fff", fontSize: 20 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    color: TEXT_PRIMARY,
                    letterSpacing: -0.5,
                    fontSize: "1rem",
                  }}
                >
                  Project Management Alkor
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: TEXT_SECONDARY,
                  maxWidth: 300,
                  lineHeight: 1.85,
                  fontWeight: 500,
                }}
              >
                A comprehensive platform for engineering teams.
                Orchestrate your projects with efficiency.
              </Typography>
            </Grid>


          </Grid>

          <Box
            sx={{
              mt: 10,
              pt: 4,
              borderTop: `1px solid ${GLASS_BORDER_DARK}`,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: alpha(TEXT_SECONDARY, 0.55), fontWeight: 600 }}
            >
              © 2026 Project Management Alkor. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={4}>
              {["Privacy", "Terms", "Security", "Status"].map((link) => (
                <Typography
                  key={link}
                  variant="caption"
                  sx={{
                    color: alpha(TEXT_SECONDARY, 0.55),
                    fontWeight: 700,
                    cursor: "pointer",
                    "&:hover": { color: TEXT_PRIMARY },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
