import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Chip,
    Alert,
} from '@mui/material';
import { doctorApi } from '../../../utils/approvalApi';
import { useAuth } from '../../../hooks/useAuth';

const AnalyticsTab: React.FC = () => {
    const { user } = useAuth();
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState(30);

    // Fetch analytics
    const fetchAnalytics = async (selectedPeriod: number = 30) => {
        if (!user?._id) return;
        
        setLoading(true);
        try {
            const response = await doctorApi.getDoctorAnalytics(user._id, { period: selectedPeriod });
            if (response.success) {
                setAnalyticsData(response.data);
            }
        } catch (error: any) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(period);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Period Selector */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">My Analytics</Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Time Period</InputLabel>
                    <Select
                        value={period}
                        onChange={(e) => {
                            setPeriod(e.target.value as number);
                            fetchAnalytics(e.target.value as number);
                        }}
                        label="Time Period"
                    >
                        <MenuItem value={7}>Last 7 days</MenuItem>
                        <MenuItem value={30}>Last 30 days</MenuItem>
                        <MenuItem value={90}>Last 90 days</MenuItem>
                        <MenuItem value={180}>Last 6 months</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {analyticsData ? (
                <Grid container spacing={3}>
                    {/* Overview Statistics */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Overview Statistics
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Total Patients</Typography>
                                            <Typography variant="h4">{analyticsData.totalPatients || 0}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Total Referrals</Typography>
                                            <Typography variant="h4">{analyticsData.totalReferrals || 0}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Pending Referrals</Typography>
                                            <Typography variant="h4" color="warning.main">
                                                {analyticsData.statusCounts?.pending || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Completed Referrals</Typography>
                                            <Typography variant="h4" color="success.main">
                                                {analyticsData.statusCounts?.completed || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Referral Status Breakdown */}
                    {analyticsData.statusCounts && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Referral Status Breakdown
                                    </Typography>
                                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {Object.entries(analyticsData.statusCounts).map(([status, count]: [string, any]) => (
                                            <Chip
                                                key={status}
                                                label={`${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`}
                                                size="small"
                                                color={
                                                    status === 'completed' ? 'success' :
                                                    status === 'pending' ? 'warning' :
                                                    status === 'accepted' ? 'info' :
                                                    'default'
                                                }
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Priority Breakdown */}
                    {analyticsData.priorityCounts && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Priority Breakdown
                                    </Typography>
                                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {Object.entries(analyticsData.priorityCounts).map(([priority, count]: [string, any]) => (
                                            <Chip
                                                key={priority}
                                                label={`${priority.charAt(0).toUpperCase() + priority.slice(1)}: ${count}`}
                                                size="small"
                                                color={
                                                    priority === 'urgent' || priority === 'high' ? 'error' :
                                                    priority === 'medium' ? 'warning' :
                                                    'success'
                                                }
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Top Specialties */}
                    {analyticsData.specialtyCounts && analyticsData.specialtyCounts.length > 0 && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Top Specialties
                                    </Typography>
                                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {analyticsData.specialtyCounts.slice(0, 10).map((item: any) => (
                                            <Chip
                                                key={item.specialty}
                                                label={`${item.specialty}: ${item.count}`}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Daily Trends */}
                    {analyticsData.dailyTrends && analyticsData.dailyTrends.length > 0 && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Daily Referral Trends
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Total referrals in the selected period: {analyticsData.dailyTrends.reduce((sum: number, day: any) => sum + day.count, 0)}
                                        </Typography>
                                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {analyticsData.dailyTrends.slice(-10).map((day: any) => (
                                                <Chip
                                                    key={day.date}
                                                    label={`${day.date}: ${day.count}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            ) : (
                <Alert severity="info">
                    No analytics data available. Analytics will be displayed here once you have referrals.
                </Alert>
            )}
        </Box>
    );
};

export default AnalyticsTab;


