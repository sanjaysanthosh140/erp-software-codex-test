import React from 'react';
import { Grid, Typography, Box, Avatar, Button, Tabs, Tab } from '@mui/material';
import { GlassContainer } from '../../components/common/GlassComp';

const UserProfile = () => {
    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-end' }}>
                <Avatar
                    src="/broken-image.jpg"
                    sx={{ width: 120, height: 120, border: '4px solid #00d4ff', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}
                />
                <Box sx={{ ml: 3, mb: 1 }}>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>Alkor User</Typography>
                    <Typography variant="body1" sx={{ color: '#a0aec0' }}>Product Owner at Antigravity</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>Edit Profile</Button>
                        <Button variant="contained" color="primary">Share Profile</Button>
                    </Box>
                </Box>
            </Box>

            <Typography variant="h6" sx={{ color: '#fff', mb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>About Me</Typography>
            <GlassContainer sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: '#a0aec0', lineHeight: 1.6 }}>
                    Passionate Product Owner with over 5 years of experience in managing agile teams and delivering high-quality software products. Dedicated to creating intuitive user experiences and efficient workflows.
                </Typography>
            </GlassContainer>

            <Typography variant="h6" sx={{ color: '#fff', mb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>Current Tasks</Typography>
            <GlassContainer>
                <Grid container spacing={2}>
                    {['Review Q3 Roadmap', 'Interview Candidate', 'Update Jira Tickets'].map((task, i) => (
                        <Grid item xs={12} sm={4} key={i}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <Typography variant="subtitle2" sx={{ color: '#fff' }}>{task}</Typography>
                                <Typography variant="caption" sx={{ color: '#00d4ff' }}>In Progress</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </GlassContainer>
        </Box>
    );
};

export default UserProfile;
