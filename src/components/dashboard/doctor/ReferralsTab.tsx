import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    CircularProgress,
    Alert,
    Chip,
    Typography,
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { doctorApi } from '../../../utils/approvalApi';
import { useAuth } from '../../../hooks/useAuth';
import { formatStatus, formatDateTime } from '../DataTable';
import { DataTable, TableColumn, TableAction } from '../';
import ViewReferralDialog from '../../dialogs/ViewReferralDialog';

const ReferralsTab: React.FC = () => {
    const { user } = useAuth();
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 10
    });
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        search: ''
    });
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);

    // Fetch referrals
    const fetchReferrals = async (page: number = 1, status?: string, priority?: string, search?: string) => {
        if (!user?._id) return;
        
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                page,
                limit: pagination.limit
            };
            if (status && status !== 'all') {
                params.status = status;
            }
            if (priority && priority !== 'all') {
                params.priority = priority;
            }
            if (search) {
                params.search = search;
            }

            const response = await doctorApi.getDoctorReferrals(user._id, params);
            if (response.success) {
                setReferrals(response.data.referrals || []);
                setStats(response.data.stats || null);
                setPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: pagination.limit
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch referrals');
            toast.error('Failed to fetch referrals');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchReferrals(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch on filter change
    useEffect(() => {
        fetchReferrals(
            1,
            filters.status !== 'all' ? filters.status : undefined,
            filters.priority !== 'all' ? filters.priority : undefined,
            filters.search || undefined
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.status, filters.priority]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchReferrals(
                1,
                filters.status !== 'all' ? filters.status : undefined,
                filters.priority !== 'all' ? filters.priority : undefined,
                filters.search || undefined
            );
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, current: page }));
        fetchReferrals(
            page,
            filters.status !== 'all' ? filters.status : undefined,
            filters.priority !== 'all' ? filters.priority : undefined,
            filters.search || undefined
        );
    };

    const handleViewReferral = (referral: any) => {
        setSelectedReferralId(referral._id);
        setViewDialogOpen(true);
    };

    const referralColumns: TableColumn[] = [
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 150,
            format: (value) => value ? `${value.firstName} ${value.lastName}` : 'N/A'
        },
        {
            id: 'referringHospital',
            label: 'From Hospital',
            minWidth: 150,
            format: (value) => value?.name || 'N/A'
        },
        {
            id: 'receivingHospital',
            label: 'To Hospital',
            minWidth: 150,
            format: (value) => value?.name || 'N/A'
        },
        {
            id: 'specialty',
            label: 'Specialty',
            minWidth: 120,
            format: (value) => <Chip label={value || 'N/A'} size="small" />
        },
        {
            id: 'priority',
            label: 'Priority',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'urgent': 'error',
                'high': 'error',
                'medium': 'warning',
                'low': 'success'
            })
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'completed': 'success',
                'accepted': 'success',
                'in_progress': 'info',
                'pending': 'warning',
                'cancelled': 'error',
                'rejected': 'error'
            })
        },
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 120,
            format: (value) => formatDateTime(value)
        }
    ];

    const referralActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewReferral,
            tooltip: 'View Referral'
        }
    ];

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">My Referrals</Typography>
            </Box>

            {/* Filters */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    placeholder="Search referrals..."
                    variant="outlined"
                    size="small"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 250, flexGrow: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        label="Status"
                    >
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="accepted">Accepted</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={filters.priority}
                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                        label="Priority"
                    >
                        <MenuItem value="all">All Priorities</MenuItem>
                        <MenuItem value="urgent">Urgent</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Stats */}
            {stats && (
                <Box display="flex" gap={2} mb={3}>
                    <Chip label={`Total: ${stats.total || 0}`} color="primary" />
                    <Chip label={`Pending: ${stats.pending || 0}`} color="warning" />
                    <Chip label={`Accepted: ${stats.accepted || 0}`} color="info" />
                    <Chip label={`Completed: ${stats.completed || 0}`} color="success" />
                </Box>
            )}

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Table */}
            <DataTable
                columns={referralColumns}
                data={referrals}
                actions={referralActions}
                loading={loading}
                emptyMessage="No referrals found"
            />

            {/* Pagination */}
            {pagination.pages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                        count={pagination.pages}
                        page={pagination.current}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            {/* View Referral Dialog */}
            <ViewReferralDialog
                open={viewDialogOpen}
                onClose={() => {
                    setViewDialogOpen(false);
                    setSelectedReferralId(null);
                }}
                referralId={selectedReferralId}
            />
        </Box>
    );
};

export default ReferralsTab;


