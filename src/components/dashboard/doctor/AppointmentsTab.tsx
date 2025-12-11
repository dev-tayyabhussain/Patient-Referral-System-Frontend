import React from 'react';
import {
    Box,
    Typography,
    Alert,
    Card,
    CardContent,
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
} from '@mui/icons-material';

const AppointmentsTab: React.FC = () => {
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">My Appointments</Typography>
            </Box>

            <Card>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                        <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Appointment Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            Appointment scheduling feature will be available soon.
                            <br />
                            This will allow you to view, manage, and schedule patient appointments.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AppointmentsTab;


