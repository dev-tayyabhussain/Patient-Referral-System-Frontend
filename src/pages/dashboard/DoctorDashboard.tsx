import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardData } from '../../hooks/useDashboardData';
import {
    StatsGrid,
    DashboardTabs,
} from '../../components/dashboard';
import { PatientsTab, ReferralsTab, AppointmentsTab, AnalyticsTab } from '../../components/dashboard/doctor';

const DoctorDashboard: React.FC = () => {
    const { user } = useAuth();
    const { data, loading, error } = useDashboardData('doctor');
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };


    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading dashboard...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!data) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="warning">
                    No data available
                </Alert>
            </Container>
        );
    }

    // Prepare stats for StatsGrid
    const statsData = [
        {
            title: 'My Patients',
            value: data.stats?.totalPatients || 0,
            subtitle: `${data.stats?.activeReferrals || 0} active referrals`,
            icon: <PeopleIcon />,
            color: 'primary' as const,
            trend: {
                value: data.stats?.monthlyGrowth?.patients || 0,
                label: 'vs last month',
                isPositive: (data.stats?.monthlyGrowth?.patients || 0) >= 0
            }
        },
        {
            title: 'Today\'s Appointments',
            value: data.stats?.todayAppointments || 0,
            subtitle: 'Scheduled appointments',
            icon: <ScheduleIcon />,
            color: 'primary' as const
        },
        {
            title: 'Referrals',
            value: data.stats?.thisMonthReferrals || 0,
            subtitle: `${data.stats?.pendingReferrals || 0} pending`,
            icon: <AssignmentIcon />,
            color: 'primary' as const,
            trend: {
                value: data.stats?.monthlyGrowth?.referrals || 0,
                label: 'vs last month',
                isPositive: (data.stats?.monthlyGrowth?.referrals || 0) >= 0
            }
        },
    ];

    // Prepare tab configurations
    const tabConfigs = [
        {
            label: 'My Patients',
            content: <PatientsTab />
        },
        {
            label: 'Appointments',
            content: <AppointmentsTab />
        },
        {
            label: 'Referrals',
            content: <ReferralsTab />
        },
        {
            label: 'Analytics',
            content: <AnalyticsTab />
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Doctor Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {data.stats?.doctorName || 'Dr. Unknown'} • {data.stats?.specialization || 'Specialization'} • Welcome back, {user?.firstName} {user?.lastName}
                </Typography>
            </Box>

            {/* Quick Stats */}
            <StatsGrid
                stats={statsData}
                loading={loading}
                sx={{ mb: 4 }}
            />

            {/* Main Content Tabs */}
            <DashboardTabs
                tabs={tabConfigs}
                value={tabValue}
                onChange={handleTabChange}
                loading={loading}
            />
        </Container>
    );
};

export default DoctorDashboard;
