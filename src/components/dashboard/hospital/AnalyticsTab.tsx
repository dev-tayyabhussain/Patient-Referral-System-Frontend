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
import { analyticsApi, referralApi } from '../../../utils/approvalApi';
import { useAuth } from '../../../hooks/useAuth';

interface AnalyticsTabProps {
    hospitalId?: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ hospitalId }) => {
    const { user } = useAuth();
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState(30);

    // Fetch analytics
    const fetchAnalytics = async (selectedPeriod: number = 30) => {
        setLoading(true);
        try {
            const [referralTrends, referralStats] = await Promise.all([
                analyticsApi.getReferralTrends({ period: selectedPeriod }),
                referralApi.getReferrals({ hospitalId: hospitalId || user?.hospitalId, limit: 1000 })
            ]);

            setAnalyticsData({
                referralTrends: referralTrends.success ? referralTrends.data : null,
                referralStats: referralStats.success ? referralStats.data?.stats : null
            });
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
                <Typography variant="h6">Analytics Dashboard</Typography>
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
                    {/* Referral Statistics */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Referral Statistics
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Total Referrals</Typography>
                                            <Typography variant="h4">{analyticsData.referralStats?.total || 0}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Pending</Typography>
                                            <Typography variant="h4" color="warning.main">
                                                {analyticsData.referralStats?.pending || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Accepted</Typography>
                                            <Typography variant="h4" color="info.main">
                                                {analyticsData.referralStats?.accepted || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Completed</Typography>
                                            <Typography variant="h4" color="success.main">
                                                {analyticsData.referralStats?.completed || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            By Priority
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {analyticsData.referralStats?.byPriority && Object.entries(analyticsData.referralStats.byPriority).map(([priority, count]: [string, any]) => (
                                                <Chip
                                                    key={priority}
                                                    label={`${priority.charAt(0).toUpperCase() + priority.slice(1)}: ${count}`}
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Referral Trends */}
                    {analyticsData.referralTrends && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Referral Trends
                                    </Typography>
                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">Total Referrals</Typography>
                                                <Typography variant="h4">{analyticsData.referralTrends?.totalReferrals || 0}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">Completed</Typography>
                                                <Typography variant="h4" color="success.main">
                                                    {analyticsData.referralTrends?.completedReferrals || 0}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">Completion Rate</Typography>
                                                <Typography variant="h4" color="primary">
                                                    {analyticsData.referralTrends?.completionRate?.toFixed(1) || 0}%
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">By Status</Typography>
                                                <Box sx={{ mt: 1 }}>
                                                    {analyticsData.referralTrends?.statusCounts && Object.entries(analyticsData.referralTrends.statusCounts).map(([status, count]: [string, any]) => (
                                                        <Chip key={status} label={`${status}: ${count}`} size="small" sx={{ mr: 1, mb: 1 }} />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Top Specialties
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {analyticsData.referralTrends?.specialtyCounts?.slice(0, 5).map((item: any) => (
                                                    <Chip
                                                        key={item.specialty}
                                                        label={`${item.specialty}: ${item.count}`}
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            ) : (
                <Alert severity="info">
                    No analytics data available. Analytics will be displayed here once data is available.
                </Alert>
            )}
        </Box>
    );
};

export default AnalyticsTab;

