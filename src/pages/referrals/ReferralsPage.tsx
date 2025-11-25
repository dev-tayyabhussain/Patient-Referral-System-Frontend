import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    Avatar,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Badge,
    FormControl,
    InputLabel,
    Select,
    Pagination,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Assignment,
    Add,
    Search,
    FilterList,
    MoreVert,
    Person,
    LocalHospital,
    Schedule,
    CheckCircle,
    Cancel,
    Pending,
    Visibility,
    Edit,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { referralApi, hospitalApi, patientApi, doctorApi } from '../../utils/approvalApi';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime } from '../../components/dashboard/DataTable';
import ReferralForm from '../../components/forms/ReferralForm';
import { Hospital } from '../../types/hospital';

const ReferralsPage: React.FC = () => {
    const { user } = useAuth();
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedReferral, setSelectedReferral] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [viewingReferral, setViewingReferral] = useState<any>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [receivingDoctors, setReceivingDoctors] = useState<any[]>([]);
    const [referringDoctors, setReferringDoctors] = useState<any[]>([]);
    const [loadingHospitals, setLoadingHospitals] = useState(false);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [loadingReceivingDoctors, setLoadingReceivingDoctors] = useState(false);
    const [loadingReferringDoctors, setLoadingReferringDoctors] = useState(false);
    const [formData, setFormData] = useState<any>({
        patientId: '',
        receivingHospitalId: '',
        receivingDoctorId: '',
        referringDoctorId: '',
        reason: '',
        priority: 'medium',
        specialty: '',
        chiefComplaint: '',
        historyOfPresentIllness: '',
        physicalExamination: '',
        diagnosis: '',
        treatmentPlan: '',
        notes: ''
    });

    // Filters
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
    });

    // Pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 10
    });

    // Fetch referrals
    const fetchReferrals = async (page: number = 1, status?: string, priority?: string, search?: string) => {
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

            const response = await referralApi.getReferrals(params);
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

    // Load hospitals, patients, and doctors for form (only for hospital role)
    useEffect(() => {
        if (user?.role !== 'hospital') return;
        
        const loadData = async () => {
            try {
                setLoadingHospitals(true);
                setLoadingPatients(true);
                setLoadingReferringDoctors(true);

                const [hospitalsRes, patientsRes, referringDoctorsRes] = await Promise.all([
                    hospitalApi.getApprovedHospitals(),
                    patientApi.getPatients({ hospitalId: user?.hospitalId, limit: 100 }),
                    doctorApi.getDoctors({ hospitalId: user?.hospitalId, limit: 100 })
                ]);

                setHospitals(hospitalsRes.data);
                setPatients(patientsRes.data?.patients || []);
                setReferringDoctors(referringDoctorsRes.data?.doctors || []);
            } catch (error) {
                console.error('Error loading form data:', error);
            } finally {
                setLoadingHospitals(false);
                setLoadingPatients(false);
                setLoadingReferringDoctors(false);
            }
        };
        loadData();
    }, [user?.hospitalId, user?.role]);

    // Fetch receiving doctors whenever receiving hospital changes
    useEffect(() => {
        const selectedHospitalId = formData.receivingHospitalId;
        if (!selectedHospitalId) {
            setReceivingDoctors([]);
            return;
        }

        let isMounted = true;
        const fetchReceivingDoctors = async () => {
            setLoadingReceivingDoctors(true);
            try {
                const response = await doctorApi.getDoctors({ hospitalId: selectedHospitalId, limit: 100 });
                if (isMounted) {
                    setReceivingDoctors(response.data?.doctors || []);
                }
            } catch (error) {
                console.error('Failed to load receiving doctors:', error);
                if (isMounted) {
                    setReceivingDoctors([]);
                }
            } finally {
                if (isMounted) {
                    setLoadingReceivingDoctors(false);
                }
            }
        };

        fetchReceivingDoctors();
        return () => {
            isMounted = false;
        };
    }, [formData.receivingHospitalId]);

    // Initial fetch
    useEffect(() => {
        fetchReferrals(1);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReferrals(1, filters.status !== 'all' ? filters.status : undefined, filters.priority !== 'all' ? filters.priority : undefined, searchTerm || undefined);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Filter changes
    useEffect(() => {
        fetchReferrals(1, filters.status !== 'all' ? filters.status : undefined, filters.priority !== 'all' ? filters.priority : undefined, searchTerm || undefined);
    }, [filters.status, filters.priority]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        fetchReferrals(page, filters.status !== 'all' ? filters.status : undefined, filters.priority !== 'all' ? filters.priority : undefined, searchTerm || undefined);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, referralId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedReferral(referralId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedReferral(null);
    };

    const handleViewReferral = async (referralId: string) => {
        try {
            const response = await referralApi.getReferralById(referralId);
            if (response.success) {
                setViewingReferral(response.data);
                setOpenDialog(true);
            }
        } catch (err: any) {
            toast.error('Failed to fetch referral details');
        }
        handleMenuClose();
    };

    const handleCreateReferral = async () => {
        if (!formData.patientId || !formData.receivingHospitalId || !formData.reason || !formData.specialty || !formData.chiefComplaint) {
            toast.error('Please fill in all required fields');
            return;
        }

        setCreateLoading(true);
        try {
            await referralApi.createReferral(formData);
            toast.success('Referral created successfully');
            setCreateDialogOpen(false);
            setFormData({
                patientId: '',
                receivingHospitalId: '',
                receivingDoctorId: '',
                referringDoctorId: '',
                reason: '',
                priority: 'medium',
                specialty: '',
                chiefComplaint: '',
                historyOfPresentIllness: '',
                physicalExamination: '',
                diagnosis: '',
                treatmentPlan: '',
                notes: ''
            });
            fetchReferrals(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.priority !== 'all' ? filters.priority : undefined,
                searchTerm || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create referral');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleOpenCreateDialog = () => {
        setFormData({
            patientId: '',
            receivingHospitalId: '',
            receivingDoctorId: '',
            referringDoctorId: '',
            reason: '',
            priority: 'medium',
            specialty: '',
            chiefComplaint: '',
            historyOfPresentIllness: '',
            physicalExamination: '',
            diagnosis: '',
            treatmentPlan: '',
            notes: ''
        });
        setCreateDialogOpen(true);
    };

    const getStatusColor = (status: string) => {
        const statusMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
            'pending': 'warning',
            'accepted': 'success',
            'rejected': 'error',
            'completed': 'info',
            'cancelled': 'error'
        };
        return statusMap[status?.toLowerCase()] || 'default';
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <Pending />;
            case 'accepted':
            case 'completed':
                return <CheckCircle />;
            case 'rejected':
            case 'cancelled':
                return <Cancel />;
            default:
                return <Assignment />;
        }
    };

    const getPriorityColor = (priority: string) => {
        const priorityMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
            'urgent': 'error',
            'high': 'error',
            'medium': 'warning',
            'low': 'success'
        };
        return priorityMap[priority?.toLowerCase()] || 'default';
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Referral Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Create, track, and manage patient referrals between healthcare providers
                    </Typography>
                </Box>
                <Box display="flex" gap={2}>
                    {user?.role === 'hospital' && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleOpenCreateDialog}
                        >
                            Create Referral
                        </Button>
                    )}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filters.status}
                            label="Status"
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="accepted">Accepted</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={filters.priority}
                            label="Priority"
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="urgent">Urgent</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Search Bar */}
            <Box mb={4}>
                <TextField
                    fullWidth
                    placeholder="Search referrals by ID, patient, specialty, or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 600 }}
                />
            </Box>

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Stats Cards */}
            {stats && (
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Total Referrals
                                        </Typography>
                                        <Typography variant="h4">
                                            {stats.total || 0}
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <Assignment />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Pending
                                        </Typography>
                                        <Typography variant="h4">
                                            {stats.pending || 0}
                                        </Typography>
                                    </Box>
                                    <Badge color="warning" variant="dot">
                                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                                            <Pending />
                                        </Avatar>
                                    </Badge>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Accepted
                                        </Typography>
                                        <Typography variant="h4">
                                            {stats.accepted || 0}
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'success.main' }}>
                                        <CheckCircle />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            Completed
                                        </Typography>
                                        <Typography variant="h4">
                                            {stats.completed || 0}
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'info.main' }}>
                                        <CheckCircle />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Referrals Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Referral Directory
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Referral ID</TableCell>
                                            <TableCell>Patient</TableCell>
                                            <TableCell>Specialty</TableCell>
                                            <TableCell>Priority</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Referring Doctor</TableCell>
                                            <TableCell>Receiving Hospital</TableCell>
                                            <TableCell>Created</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {referrals.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        No referrals found
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            referrals.map((referral) => (
                                                <TableRow key={referral._id} hover>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" color="primary">
                                                            {referral.referralId || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                                <Person sx={{ fontSize: 16 }} />
                                                            </Avatar>
                                                            <Typography variant="body2">
                                                                {referral.patient?.firstName} {referral.patient?.lastName}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={referral.specialty || 'N/A'}
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={referral.priority || 'N/A'}
                                                            color={getPriorityColor(referral.priority) as any}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Chip
                                                                icon={getStatusIcon(referral.status)}
                                                                label={referral.status || 'N/A'}
                                                                color={getStatusColor(referral.status) as any}
                                                                size="small"
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {referral.referringDoctor ? `Dr. ${referral.referringDoctor.firstName} ${referral.referringDoctor.lastName}` : 'N/A'}
                                                        </Typography>
                                                        {referral.referringHospital && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {referral.referringHospital.name}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <LocalHospital sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                            <Typography variant="body2">
                                                                {referral.receivingHospital?.name || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                            <Typography variant="body2">
                                                                {formatDateTime(referral.createdAt)}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            onClick={(e) => handleMenuOpen(e, referral._id)}
                                                            size="small"
                                                        >
                                                            <MoreVert />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

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
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => selectedReferral && handleViewReferral(selectedReferral)}>
                    <Visibility sx={{ mr: 1 }} fontSize="small" />
                    View Details
                </MenuItem>
            </Menu>

            {/* View Referral Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Referral Details</DialogTitle>
                <DialogContent>
                    {viewingReferral && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Referral ID</Typography>
                                    <Typography variant="body1">{viewingReferral.referralId || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                    <Chip
                                        label={viewingReferral.status || 'N/A'}
                                        color={getStatusColor(viewingReferral.status) as any}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                                    <Typography variant="body1">
                                        {viewingReferral.patient?.firstName} {viewingReferral.patient?.lastName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                                    <Chip
                                        label={viewingReferral.priority || 'N/A'}
                                        color={getPriorityColor(viewingReferral.priority) as any}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Specialty</Typography>
                                    <Typography variant="body1">{viewingReferral.specialty || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Referring Doctor</Typography>
                                    <Typography variant="body1">
                                        {viewingReferral.referringDoctor ? `Dr. ${viewingReferral.referringDoctor.firstName} ${viewingReferral.referringDoctor.lastName}` : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Referring Hospital</Typography>
                                    <Typography variant="body1">{viewingReferral.referringHospital?.name || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Receiving Hospital</Typography>
                                    <Typography variant="body1">{viewingReferral.receivingHospital?.name || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Reason</Typography>
                                    <Typography variant="body1">{viewingReferral.reason || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Chief Complaint</Typography>
                                    <Typography variant="body1">{viewingReferral.chiefComplaint || 'N/A'}</Typography>
                                </Grid>
                                {viewingReferral.diagnosis && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Diagnosis</Typography>
                                        <Typography variant="body1">{viewingReferral.diagnosis}</Typography>
                                    </Grid>
                                )}
                                {viewingReferral.notes && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                                        <Typography variant="body1">{viewingReferral.notes}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Create Referral Dialog */}
            {user?.role === 'hospital' && (
                <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Create New Referral</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <ReferralForm
                                formData={formData}
                                setFormData={setFormData}
                                hospitals={hospitals}
                                patients={patients}
                                receivingDoctors={receivingDoctors}
                                referringDoctors={referringDoctors}
                                loadingHospitals={loadingHospitals}
                                loadingPatients={loadingPatients}
                                loadingReceivingDoctors={loadingReceivingDoctors}
                                loadingReferringDoctors={loadingReferringDoctors}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateDialogOpen(false)} disabled={createLoading}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleCreateReferral}
                            disabled={createLoading}
                            startIcon={createLoading ? <CircularProgress size={20} /> : <Add />}
                        >
                            {createLoading ? 'Creating...' : 'Create Referral'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default ReferralsPage;
