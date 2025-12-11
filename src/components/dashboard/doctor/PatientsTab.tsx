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
import { formatStatus, formatAvatar, formatDateTime } from '../DataTable';
import { DataTable, TableColumn, TableAction } from '../';
import ViewPatientDialog from '../../dialogs/ViewPatientDialog';

const PatientsTab: React.FC = () => {
    const { user } = useAuth();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 10
    });
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    // Fetch patients
    const fetchPatients = async (page: number = 1, status?: string, search?: string) => {
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
            if (search) {
                params.search = search;
            }

            const response = await doctorApi.getDoctorPatients(user._id, params);
            if (response.success) {
                setPatients(response.data.patients || []);
                setPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: pagination.limit
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch patients');
            toast.error('Failed to fetch patients');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPatients(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch on filter change
    useEffect(() => {
        fetchPatients(
            1,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.status]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPatients(
                1,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined
            );
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, current: page }));
        fetchPatients(
            page,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined
        );
    };

    const handleViewPatient = (patient: any) => {
        setSelectedPatientId(patient._id);
        setViewDialogOpen(true);
    };

    const patientColumns: TableColumn[] = [
        {
            id: 'name',
            label: 'Patient',
            minWidth: 200,
            format: (_value, row) => formatAvatar(`${row.firstName} ${row.lastName}`, row.profileImage)
        },
        {
            id: 'age',
            label: 'Age/Gender',
            minWidth: 120,
            format: (value, row) => `${value || 'N/A'} / ${row.gender || 'N/A'}`
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 200
        },
        {
            id: 'phone',
            label: 'Phone',
            minWidth: 150
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'active': 'success',
                'inactive': 'error',
                'pending': 'warning'
            })
        },
        {
            id: 'createdAt',
            label: 'Registered',
            minWidth: 120,
            format: (value) => formatDateTime(value)
        }
    ];

    const patientActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewPatient,
            tooltip: 'View Patient'
        }
    ];

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">My Patients</Typography>
            </Box>

            {/* Filters */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    placeholder="Search patients..."
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
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Table */}
            <DataTable
                columns={patientColumns}
                data={patients}
                actions={patientActions}
                loading={loading}
                emptyMessage="No patients found"
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

            {/* View Patient Dialog */}
            <ViewPatientDialog
                open={viewDialogOpen}
                onClose={() => {
                    setViewDialogOpen(false);
                    setSelectedPatientId(null);
                }}
                patientId={selectedPatientId}
            />
        </Box>
    );
};

export default PatientsTab;


