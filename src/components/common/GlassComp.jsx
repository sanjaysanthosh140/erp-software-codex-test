import React from 'react';
import { Box, styled } from '@mui/material';

export const GlassContainer = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(3),
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.15)',
        border: '1px solid rgba(0, 212, 255, 0.3)',
    },
}));

export const GlowText = styled('span')(({ theme, color = '#00d4ff' }) => ({
    textShadow: `0 0 10px ${color}, 0 0 20px ${color}aa`,
    fontWeight: 'bold',
}));
