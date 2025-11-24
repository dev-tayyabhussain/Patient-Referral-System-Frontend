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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    Typography,
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { referralApi, hospitalApi, patientApi, doctorApi } from '../../../utils/approvalApi';
import { useAuth } from '../../../hooks/useAuth';
import { Hospital } from '../../../types/hospital';
import { formatStatus, formatDateTime } from '../DataTable';
import { DataTable, TableColumn, TableAction } from '../';
import ReferralForm from '../../forms/ReferralForm';
import ViewReferralDialog from '../../dialogs/ViewReferralDialog';

interface ReferralsTabProps {
    hospitalId?: string;
}

const ReferralsTab: React.FC<ReferralsTabProps> = ({ hospitalId }) => {
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
    const [openDialog, setOpenDialog] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loadingHospitals, setLoadingHospitals] = useState(false);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingReferral, setEditingReferral] = useState<any>(null);
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

    // Fetch referrals
    const fetchReferrals = async (page: number = 1, status?: string, priority?: string, search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                page,
                limit: pagination.limit
                // Remove hospitalId for hospital admins - backend handles it automatically
                // Only super_admin should pass hospitalId to filter by specific hospital
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

    // Load hospitals, patients, and doctors for form
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingHospitals(true);
                setLoadingPatients(true);
                setLoadingDoctors(true);

                const [hospitalsRes, patientsRes, doctorsRes] = await Promise.all([
                    hospitalApi.getApprovedHospitals(),
                    patientApi.getPatients({ hospitalId: hospitalId || user?.hospitalId, limit: 100 }),
                    doctorApi.getDoctors({ hospitalId: hospitalId || user?.hospitalId, limit: 100 })
                ]);

                setHospitals(hospitalsRes.data);
                setPatients(patientsRes.data?.patients || []);
                setDoctors(doctorsRes.data?.doctors || []);
            } catch (error) {
                console.error('Error loading form data:', error);
            } finally {
                setLoadingHospitals(false);
                setLoadingPatients(false);
                setLoadingDoctors(false);
            }
        };
        loadData();
    }, [hospitalId, user?.hospitalId]);

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


    const handleCreateReferral = async () => {
        if (!formData.patientId || !formData.receivingHospitalId || !formData.reason || !formData.specialty || !formData.chiefComplaint) {
            toast.error('Please fill in all required fields');
            return;
        }

        setCreateLoading(true);
        try {
            await referralApi.createReferral(formData);
            toast.success('Referral created successfully');
            setOpenDialog(false);
            fetchReferrals(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.priority !== 'all' ? filters.priority : undefined,
                filters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create referral');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleViewReferral = (referral: any) => {
        setSelectedReferralId(referral._id);
        setViewDialogOpen(true);
    };

    const handleEditReferral = (referral: any) => {
        setEditingReferral(referral);
        setIsEditMode(true);
        // Populate form with referral data
        setFormData({
            patientId: referral.patient?._id || referral.patient || '',
            receivingHospitalId: referral.receivingHospital?._id || referral.receivingHospital || '',
            receivingDoctorId: referral.receivingDoctor?._id || referral.receivingDoctor || '',
            referringDoctorId: referral.referringDoctor?._id || referral.referringDoctor || '',
            reason: referral.reason || '',
            priority: referral.priority || 'medium',
            specialty: referral.specialty || '',
            chiefComplaint: referral.chiefComplaint || '',
            historyOfPresentIllness: referral.historyOfPresentIllness || '',
            physicalExamination: referral.physicalExamination || '',
            diagnosis: referral.diagnosis || '',
            treatmentPlan: referral.treatmentPlan || '',
            notes: referral.notes || ''
        });
        setOpenDialog(true);
    };

    const handleUpdateReferral = async () => {
        if (!editingReferral) return;
        if (!formData.patientId || !formData.receivingHospitalId || !formData.reason || !formData.specialty || !formData.chiefComplaint) {
            toast.error('Please fill in all required fields');
            return;
        }

        setCreateLoading(true);
        try {
            await referralApi.updateReferral(editingReferral._id, formData);
            toast.success('Referral updated successfully');
            setOpenDialog(false);
            setIsEditMode(false);
            setEditingReferral(null);
            fetchReferrals(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.priority !== 'all' ? filters.priority : undefined,
                filters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update referral');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setIsEditMode(false);
        setEditingReferral(null);
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
        setOpenDialog(true);
    };

    const referralColumns: TableColumn[] = [
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 150,
            format: (value) => value ? `${value.firstName} ${value.lastName}` : 'N/A'
        },
        {
            id: 'referringDoctor',
            label: 'From Doctor',
            minWidth: 150,
            format: (value) => value ? `Dr. ${value.firstName} ${value.lastName}` : 'N/A'
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
        },
        {
            icon: <EditIcon />,
            onClick: handleEditReferral,
            tooltip: 'Edit Referral'
        }
    ];

    return (
        <Box>
            {/* Header with Add Button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Referrals</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    Create Referral
                </Button>
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

            {/* Create/Edit Referral Dialog */}
            <Dialog open={openDialog} onClose={() => {
                setOpenDialog(false);
                setIsEditMode(false);
                setEditingReferral(null);
            }} maxWidth="md" fullWidth>
                <DialogTitle>{isEditMode ? 'Edit Referral' : 'Create New Referral'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <ReferralForm
                            formData={formData}
                            setFormData={setFormData}
                            hospitals={hospitals}
                            patients={patients}
                            doctors={doctors}
                            loadingHospitals={loadingHospitals}
                            loadingPatients={loadingPatients}
                            loadingDoctors={loadingDoctors}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDialog(false);
                        setIsEditMode(false);
                        setEditingReferral(null);
                    }} disabled={createLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={isEditMode ? handleUpdateReferral : handleCreateReferral}
                        disabled={createLoading}
                        startIcon={createLoading ? <CircularProgress size={20} /> : <AddIcon />}
                    >
                        {createLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Referral' : 'Create Referral')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Referral Dialog */}
            <ViewReferralDialog
                open={viewDialogOpen}
                onClose={() => {
                    setViewDialogOpen(false);
                    setSelectedReferralId(null);
                }}
                referralId={selectedReferralId}
                onEdit={(referral) => {
                    setViewDialogOpen(false);
                    handleEditReferral(referral);
                }}
            />
        </Box>
    );
};

export default ReferralsTab;

