import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const glassStyle = {
    background: 'rgba(20, 25, 40, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
};

let theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 481,
            md: 769,
            lg: 1025,
            xl: 1280,
        },
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#00d4ff',
            light: '#5ee2ff',
            dark: '#009bb3',
        },
        secondary: {
            main: '#b721ff',
        },
        background: {
            default: '#0a0e17',
            paper: '#131926',
        },
        text: {
            primary: '#ffffff',
            secondary: '#a0aec0',
        },
    },
    typography: {
        // Base font – MUI responsiveFontSizes will scale all variants
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        htmlFontSize: 16,
        // Headings
        h1: { fontWeight: 700, fontSize: '2.4rem' },
        h2: { fontWeight: 700, fontSize: '1.8rem' },
        h3: { fontWeight: 600, fontSize: '1.4rem' },
        h4: { fontWeight: 600, fontSize: '1.2rem' },
        h5: { fontWeight: 600, fontSize: '1.05rem' },
        h6: { fontWeight: 600, fontSize: '0.95rem' },
        // Body text
        body1: { fontSize: '0.95rem', lineHeight: 1.6 },
        body2: { fontSize: '0.85rem', lineHeight: 1.5 },
        // Small / caption
        subtitle1: { fontSize: '0.9rem',  fontWeight: 500 },
        subtitle2: { fontSize: '0.8rem',  fontWeight: 500 },
        caption:   { fontSize: '0.75rem', lineHeight: 1.4 },
        overline:  { fontSize: '0.7rem',  letterSpacing: '0.08em', textTransform: 'uppercase' },
        // Buttons – no all-caps
        button: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
    },
    components: {
        /* ── CSS Baseline ─────────────────────────────────────── */
        MuiCssBaseline: {
            styleOverrides: {
                '*, *::before, *::after': { boxSizing: 'border-box' },
                html: {
                    // sync with index.css fluid font
                    fontSize: 'clamp(13px, 1vw + 10px, 16px)',
                },
                body: {
                    backgroundImage: 'radial-gradient(circle at 50% 0%, #1a2035 0%, #0a0e17 60%)',
                    minHeight: '100vh',
                    width: '100%',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    scrollbarColor: '#2d3748 #0a0e17',
                    '&::-webkit-scrollbar': { width: '6px', height: '6px' },
                    '&::-webkit-scrollbar-track': { background: '#0a0e17' },
                    '&::-webkit-scrollbar-thumb': { background: '#2d3748', borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb:hover': { background: '#4a5568' },
                },
            },
        },

        /* ── Paper ────────────────────────────────────────────── */
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    ...glassStyle,
                    transition: 'all 0.3s ease-in-out',
                },
            },
        },

        /* ── Card ─────────────────────────────────────────────── */
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    ...glassStyle,
                    borderRadius: '16px',
                    overflow: 'visible',
                    transition: 'all 0.3s ease-in-out',
                },
            },
        },

        /* ── Button ───────────────────────────────────────────── */
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    textTransform: 'none',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 0 10px rgba(0, 212, 255, 0.1)',
                    transition: 'all 0.2s ease-in-out',
                    // Touch-friendly minimum tap target
                    minHeight: '40px',
                    padding: '6px 16px',
                    '&:hover': {
                        boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
                        transform: 'translateY(-1px)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.8) 0%, rgba(0, 155, 179, 0.8) 100%)',
                    border: '1px solid rgba(255,255,255,0.2)',
                },
                sizeSmall: {
                    fontSize: '0.8rem',
                    minHeight: '34px',
                    padding: '4px 12px',
                },
                sizeLarge: {
                    fontSize: '1rem',
                    minHeight: '48px',
                    padding: '10px 24px',
                },
            },
        },

        /* ── Drawer ───────────────────────────────────────────── */
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: 'rgba(10, 14, 23, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                    // Ensure drawer never breaks mobile layout
                    maxWidth: '85vw',
                },
            },
        },

        /* ── AppBar ───────────────────────────────────────────── */
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    background: 'rgba(10, 14, 23, 0.7)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: 'none',
                    width: '100%',
                },
            },
        },

        /* ── Typography (global) ──────────────────────────────── */
        MuiTypography: {
            styleOverrides: {
                root: {
                    // Prevent text overflow on small screens
                    wordBreak: 'break-word',
                },
            },
        },

        /* ── Tables ───────────────────────────────────────────── */
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    overflowX: 'auto',      // scroll narrow tables on mobile
                    width: '100%',
                    maxWidth: '100%',
                },
            },
        },

        /* ── IconButton ───────────────────────────────────────── */
        MuiIconButton: {
            styleOverrides: {
                root: {
                    // Larger tap target on touch devices
                    padding: '8px',
                },
                sizeSmall: { padding: '4px' },
            },
        },

        /* ── Dialog ───────────────────────────────────────────── */
        MuiDialog: {
            styleOverrides: {
                paper: {
                    margin: '16px',
                    maxWidth: 'calc(100vw - 32px)',
                    width: '100%',
                },
            },
        },
    },
});

// responsiveFontSizes automatically scales all typography variants
// across xs → xl breakpoints using a factor of 0.8 (80 %)
theme = responsiveFontSizes(theme, { factor: 3 });

export default theme;
