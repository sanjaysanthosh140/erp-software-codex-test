/**
 * Topbar.jsx – responsive.
 * Mobile: shows hamburger icon to toggle the sidebar drawer.
 * Desktop: hides hamburger; shows search + user menu.
 */
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Box, InputBase, IconButton,
  Typography, Avatar, alpha, useMediaQuery, useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

const PRIMARY_SLATE = "#0f172a";
const SECONDARY_SLATE = "#475569";
const INDIGO_ACCENT = "#4f46e5";
const GLASS_BG = "rgba(255, 255, 255, 0.25)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.4)";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  '&:hover': {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    border: `1px solid ${alpha(PRIMARY_SLATE, 0.1)}`,
  },
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  // Take all available space between hamburger and avatar
  flexGrow: 1,
  maxWidth: '600px',
  border: `1px solid ${GLASS_BORDER}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  // Hide search on very small phones to save horizontal space
  [theme.breakpoints.down('xs')]: {
    display: 'none',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(SECONDARY_SLATE, 0.5),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: PRIMARY_SLATE,
  fontWeight: 500,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3.5)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: 'clamp(0.78rem, 1.5vw, 0.9rem)',
    '&::placeholder': {
      color: alpha(SECONDARY_SLATE, 0.5),
      opacity: 1,
    },
  },
}));

// Props: onMenuToggle (fn), isMobile (bool)
const Topbar = ({ onMenuToggle, isMobile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // < 481px

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        background: GLASS_BG,
        backdropFilter: 'blur(48px) saturate(180%)',
        boxShadow: '0 4px 20px rgba(10, 15, 25, 0.03)',
        borderBottom: `1px solid ${GLASS_BORDER}`,
        color: PRIMARY_SLATE,
        width: '100%',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: { xs: 56, sm: 64, md: 72 },
          px: { xs: 1, sm: 2, md: 3 },
          gap: 1,
        }}
      >
        {/* Hamburger – only on mobile */}
        {isMobile && (
          <IconButton
            onClick={onMenuToggle}
            edge="start"
            size="medium"
            sx={{ color: PRIMARY_SLATE, mr: 0.5, flexShrink: 0 }}
            aria-label="open sidebar"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Search bar – centred between hamburger and avatar */}
        {!isXs && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={isMobile ? "Search…" : "Search projects, tasks, or team members..."}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        )}

        {/* Spacer when search hidden */}
        {isXs && <Box sx={{ flexGrow: 1 }} />}

        {/* User avatar / name */}
        <Box
          onClick={() => {}}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1.5 },
            cursor: 'pointer',
            flexShrink: 0,
            p: 0.5,
            pr: { xs: 0.5, sm: 1.5 },
            borderRadius: '24px',
            background: 'rgba(15, 23, 42, 0.04)',
            border: `1px solid ${alpha(PRIMARY_SLATE, 0.05)}`,
            transition: 'all 0.2s ease',
            '&:hover': { background: 'rgba(15, 23, 42, 0.08)' },
          }}
        >
          <Avatar
            sx={{
              width: { xs: 30, sm: 34 },
              height: { xs: 30, sm: 34 },
              bgcolor: alpha(INDIGO_ACCENT, 0.1),
              color: INDIGO_ACCENT,
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              fontWeight: 800,
              border: `1px solid ${alpha(INDIGO_ACCENT, 0.2)}`,
            }}
            src="/path-to-avatar.jpg"
          >
            A
          </Avatar>
          {/* Hide name on small phones */}
          {!isXs && (
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 800, color: PRIMARY_SLATE, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
            >
              Alkor
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
