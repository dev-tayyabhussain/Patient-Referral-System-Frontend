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
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { patientApi, hospitalApi } from '../../../utils/approvalApi';
import { useAuth } from '../../../hooks/useAuth';
import { Hospital } from '../../../types/hospital';
import { formatStatus } from '../DataTable';
import { DataTable, TableColumn, TableAction } from '../';
import PatientForm from '../../forms/PatientForm';
import ViewPatientDialog from '../../dialogs/ViewPatientDialog';
import DeleteConfirmDialog from '../../dialogs/DeleteConfirmDialog';

interface PatientsTabProps {
    hospitalId?: string;
}

const PatientsTab: React.FC<PatientsTabProps> = ({ hospitalId }) => {
    const { user } = useAuth();
    const [patients, setPatients] = useState<any[]>([]);
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
        search: ''
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loadingHospitals, setLoadingHospitals] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<any>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingPatient, setEditingPatient] = useState<any>(null);
    const [formData, setFormData] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
        },
        hospitalId: hospitalId || user?.hospitalId || '',
        bloodType: '',
        allergies: [],
        chronicConditions: [],
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: ''
        },
        emergencyPhone: ''
    });

    // Fetch patients
    const fetchPatients = async (page: number = 1, status?: string, search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                page,
                limit: 10, // Use constant instead of pagination.limit to avoid stale closure
                hospitalId: hospitalId || user?.hospitalId
            };
            if (status && status !== 'all') {
                params.status = status;
            }
            if (search) {
                params.search = search;
            }

            const response = await patientApi.getPatients(params);
            if (response.success) {
                setPatients(response.data.patients || []);
                setStats(response.data.stats || null);
                setPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: response.data.pagination?.limit || 10
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch patients');
            toast.error('Failed to fetch patients');
        } finally {
            setLoading(false);
        }
    };

    // Load hospitals
    useEffect(() => {
        const loadHospitals = async () => {
            try {
                setLoadingHospitals(true);
                const response = await hospitalApi.getApprovedHospitals();
                setHospitals(response.data);
            } catch (error) {
                console.error('Error loading hospitals:', error);
            } finally {
                setLoadingHospitals(false);
            }
        };
        loadHospitals();
    }, []);

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

    const handleCreatePatient = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!formData.emergencyPhone && !formData.emergencyContact?.phone) {
            toast.error('Emergency phone is required');
            return;
        }

        setCreateLoading(true);
        try {
            const patientData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
                gender: (formData.gender && formData.gender !== '') ? formData.gender : undefined,
                address: formData.address,
                hospitalId: formData.hospitalId,
                bloodType: formData.bloodType || undefined,
                allergies: formData.allergies || [],
                chronicConditions: formData.chronicConditions || [],
                emergencyContact: formData.emergencyContact,
                emergencyPhone: formData.emergencyPhone || formData.emergencyContact?.phone
            };

            await patientApi.createPatient(patientData);
            toast.success('Patient created successfully');
            setOpenDialog(false);
            fetchPatients(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create patient');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleViewPatient = (patient: any) => {
        setSelectedPatientId(patient._id);
        setViewDialogOpen(true);
    };

    const handleEditPatient = (patient: any) => {
        setEditingPatient(patient);
        setIsEditMode(true);
        // Populate form with patient data
        setFormData({
            firstName: patient.firstName || '',
            lastName: patient.lastName || '',
            email: patient.email || '',
            password: '', // Don't populate password
            phone: patient.phone || '',
            dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
            gender: patient.gender || '',
            address: patient.address || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'USA'
            },
            hospitalId: typeof patient.hospitalId === 'object' ? patient.hospitalId._id : (patient.hospitalId || hospitalId || user?.hospitalId || ''),
            bloodType: patient.bloodType || '',
            allergies: patient.allergies || [],
            chronicConditions: patient.chronicConditions || [],
            emergencyContact: typeof patient.emergencyContact === 'string' ? {
                name: '',
                relationship: '',
                phone: patient.emergencyPhone || '',
                email: ''
            } : (patient.emergencyContact || {
                name: '',
                relationship: '',
                phone: '',
                email: ''
            }),
            emergencyPhone: patient.emergencyPhone || ''
        });
        setOpenDialog(true);
    };

    const handleDeletePatient = (patient: any) => {
        setPatientToDelete(patient);
        setDeleteDialogOpen(true);
    };

    const confirmDeletePatient = async () => {
        if (!patientToDelete) return;
        setDeleteLoading(true);
        try {
            await patientApi.deletePatient(patientToDelete._id);
            toast.success('Patient deleted successfully');
            setDeleteDialogOpen(false);
            setPatientToDelete(null);
            fetchPatients(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete patient');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleUpdatePatient = async () => {
        if (!editingPatient) return;
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!formData.emergencyPhone && !formData.emergencyContact?.phone) {
            toast.error('Emergency phone is required');
            return;
        }

        setCreateLoading(true);
        try {
            const patientData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
                gender: (formData.gender && formData.gender !== '') ? formData.gender : undefined,
                address: formData.address,
                hospitalId: formData.hospitalId,
                bloodType: formData.bloodType || undefined,
                allergies: formData.allergies || [],
                chronicConditions: formData.chronicConditions || [],
                emergencyContact: formData.emergencyContact,
                emergencyPhone: formData.emergencyPhone || formData.emergencyContact?.phone
            };

            if (formData.password) {
                patientData.password = formData.password;
            }

            await patientApi.updatePatient(editingPatient._id, patientData);
            toast.success('Patient updated successfully');
            setOpenDialog(false);
            setIsEditMode(false);
            setEditingPatient(null);
            fetchPatients(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update patient');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setIsEditMode(false);
        setEditingPatient(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            dateOfBirth: '',
            gender: '',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'USA'
            },
            hospitalId: hospitalId || user?.hospitalId || '',
            bloodType: '',
            allergies: [],
            chronicConditions: [],
            emergencyContact: {
                name: '',
                relationship: '',
                phone: '',
                email: ''
            },
            emergencyPhone: ''
        });
        setOpenDialog(true);
    };

    const patientColumns: TableColumn[] = [
        {
            id: 'name',
            label: 'Patient',
            minWidth: 200,
            format: (_value, row) => `${row.firstName} ${row.lastName}`
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 200
        },
        {
            id: 'phone',
            label: 'Phone',
            minWidth: 120
        },
        {
            id: 'dateOfBirth',
            label: 'Age',
            minWidth: 100,
            format: (value) => {
                if (!value) return 'N/A';
                const birthDate = new Date(value);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return `${age} years`;
            }
        },
        {
            id: 'gender',
            label: 'Gender',
            minWidth: 100
        },
        {
            id: 'bloodType',
            label: 'Blood Type',
            minWidth: 100,
            format: (value) => value || 'N/A'
        },
        {
            id: 'approvalStatus',
            label: 'Status',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'approved': 'success',
                'pending': 'warning',
                'rejected': 'error'
            })
        }
    ];

    const patientActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewPatient,
            tooltip: 'View Patient'
        },
        {
            icon: <EditIcon />,
            onClick: handleEditPatient,
            tooltip: 'Edit Patient'
        },
        {
            icon: <DeleteIcon />,
            onClick: handleDeletePatient,
            color: 'error',
            tooltip: 'Delete Patient'
        }
    ];

    return (
        <Box>
            {/* Header with Add Button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Patients</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    Add Patient
                </Button>
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
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Stats */}
            {stats && (
                <Box display="flex" gap={2} mb={3}>
                    <Chip label={`Total: ${stats.total || 0}`} color="primary" />
                    <Chip label={`Active: ${stats.active || 0}`} color="success" />
                    <Chip label={`Pending: ${stats.pending || 0}`} color="warning" />
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

            {/* Add/Edit Patient Dialog */}
            <Dialog open={openDialog} onClose={() => {
                setOpenDialog(false);
                setIsEditMode(false);
                setEditingPatient(null);
            }} maxWidth="md" fullWidth>
                <DialogTitle>{isEditMode ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <PatientForm
                            formData={formData}
                            setFormData={setFormData}
                            hospitals={hospitals}
                            loadingHospitals={loadingHospitals}
                            userRole={user?.role}
                            userHospitalId={user?.hospitalId}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDialog(false);
                        setIsEditMode(false);
                        setEditingPatient(null);
                    }} disabled={createLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={isEditMode ? handleUpdatePatient : handleCreatePatient}
                        disabled={createLoading}
                        startIcon={createLoading ? <CircularProgress size={20} /> : <AddIcon />}
                    >
                        {createLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Patient' : 'Create Patient')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Patient Dialog */}
            <ViewPatientDialog
                open={viewDialogOpen}
                onClose={() => {
                    setViewDialogOpen(false);
                    setSelectedPatientId(null);
                }}
                patientId={selectedPatientId}
                onEdit={(patient) => {
                    setViewDialogOpen(false);
                    handleEditPatient(patient);
                }}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setPatientToDelete(null);
                }}
                onConfirm={confirmDeletePatient}
                title="Delete Patient"
                message="This action cannot be undone. The patient will be permanently removed from the system."
                itemName={patientToDelete ? `${patientToDelete.firstName} ${patientToDelete.lastName}` : undefined}
                loading={deleteLoading}
            />
        </Box>
    );
};

export default PatientsTab;

