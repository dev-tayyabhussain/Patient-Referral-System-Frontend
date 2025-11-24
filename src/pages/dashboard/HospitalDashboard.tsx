import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    People as PeopleIcon,
    LocalHospital as HospitalIcon,
    Assignment as AssignmentIcon,
    MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardData } from '../../hooks/useDashboardData';
import {
    StatsGrid,
    DashboardTabs,
} from '../../components/dashboard';
import { DoctorsTab, ReferralsTab, PatientsTab, AnalyticsTab } from '../../components/dashboard/hospital';
import { doctorApi, referralApi, patientApi } from '../../utils/approvalApi';

const HospitalDashboard: React.FC = () => {
    const { user } = useAuth();
    const { data, loading, error } = useDashboardData('hospital');
    const [tabValue, setTabValue] = useState(0);
    const [stats, setStats] = useState<any>(null);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Fetch dynamic stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [doctorsRes, referralsRes, patientsRes] = await Promise.all([
                    doctorApi.getDoctors({ hospitalId: user?.hospitalId, limit: 1 }),
                    referralApi.getReferrals({ hospitalId: user?.hospitalId, limit: 1 }),
                    patientApi.getPatients({ hospitalId: user?.hospitalId, limit: 1 })
                ]);

                setStats({
                    totalDoctors: doctorsRes.data?.stats?.total || 0,
                    activeDoctors: doctorsRes.data?.stats?.active || 0,
                    pendingDoctors: doctorsRes.data?.stats?.pending || 0,
                    totalReferrals: referralsRes.data?.stats?.total || 0,
                    pendingReferrals: referralsRes.data?.stats?.pending || 0,
                    totalPatients: patientsRes.data?.stats?.total || 0,
                    activePatients: patientsRes.data?.stats?.active || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        if (user?.hospitalId) {
            fetchStats();
        }
    }, [user?.hospitalId]);

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
            title: 'Doctors',
            value: stats?.totalDoctors || 0,
            subtitle: `${stats?.activeDoctors || 0} active`,
            icon: <MedicalServicesIcon />,
            color: 'primary' as const,
        },
        {
            title: 'Patients',
            value: stats?.totalPatients || 0,
            subtitle: `${stats?.activePatients || 0} active`,
            icon: <PeopleIcon />,
            color: 'primary' as const,
        },
        {
            title: 'Referrals',
            value: stats?.totalReferrals || 0,
            subtitle: `${stats?.pendingReferrals || 0} pending`,
            icon: <AssignmentIcon />,
            color: 'primary' as const,
        },
        {
            title: 'System Status',
            value: 'Operational',
            subtitle: 'All systems operational',
            icon: <HospitalIcon />,
            color: 'success' as const,
        }
    ];

    // Prepare tab configurations
    const tabConfigs = [
        {
            label: 'Doctors',
            content: <DoctorsTab hospitalId={user?.hospitalId} />
        },
        {
            label: 'Referrals',
            content: <ReferralsTab hospitalId={user?.hospitalId} />
        },
        {
            label: 'Patients',
            content: <PatientsTab hospitalId={user?.hospitalId} />
        },
        {
            label: 'Analytics',
            content: <AnalyticsTab hospitalId={user?.hospitalId} />
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Hospital Admin Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {data.stats?.hospitalName || 'Hospital'} • Welcome back, {user?.firstName} {user?.lastName}
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

export default HospitalDashboard;
