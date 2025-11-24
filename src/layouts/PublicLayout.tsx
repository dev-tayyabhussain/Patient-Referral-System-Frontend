import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/layout/Navbar';

const PublicLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
                <Outlet />
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 6,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: 'grey.50',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 700 }}>
                            MediNet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            The National Healthcare Referral & Health Record Management System
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            © 2024 MediNet. All rights reserved. Built with ❤️ for better healthcare.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default PublicLayout;