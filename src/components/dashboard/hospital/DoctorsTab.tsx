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
import { doctorApi, hospitalApi } from '../../../utils/approvalApi';
import { useAuth } from '../../../hooks/useAuth';
import { Hospital } from '../../../types/hospital';
import { formatStatus, formatAvatar } from '../DataTable';
import { DataTable, TableColumn, TableAction } from '../';
import DoctorForm from '../../forms/DoctorForm';
import ViewDoctorDialog from '../../dialogs/ViewDoctorDialog';
import DeleteConfirmDialog from '../../dialogs/DeleteConfirmDialog';

interface DoctorsTabProps {
    hospitalId?: string;
}

const DoctorsTab: React.FC<DoctorsTabProps> = ({ hospitalId }) => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState<any[]>([]);
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
        search: '',
        specialization: 'all'
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loadingHospitals, setLoadingHospitals] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState<any>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<any>(null);
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
            country: 'UK'
        },
        practiceType: 'hospital',
        hospitalId: hospitalId || user?.hospitalId || '',
        clinicName: '',
        clinicAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'UK'
        },
        clinicPhone: '',
        clinicEmail: '',
        clinicWebsite: '',
        clinicDescription: '',
        licenseNumber: '',
        specialization: '',
        yearsOfExperience: 0,
        qualification: ''
    });

    // Fetch doctors
    const fetchDoctors = async (page: number = 1, status?: string, search?: string, specialization?: string) => {
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
            if (specialization && specialization !== 'all') {
                params.specialization = specialization;
            }

            const response = await doctorApi.getDoctors(params);
            if (response.success) {
                setDoctors(response.data.doctors || []);
                setStats(response.data.stats || null);
                setPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: response.data.pagination?.limit || 10
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch doctors');
            toast.error('Failed to fetch doctors');
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
        fetchDoctors(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch on filter change
    useEffect(() => {
        fetchDoctors(
            1,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined,
            filters.specialization !== 'all' ? filters.specialization : undefined
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.status, filters.specialization]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDoctors(
                1,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined,
                filters.specialization !== 'all' ? filters.specialization : undefined
            );
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, current: page }));
        fetchDoctors(
            page,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined,
            filters.specialization !== 'all' ? filters.specialization : undefined
        );
    };

    const handleCreateDoctor = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.practiceType === 'hospital' && !formData.hospitalId) {
            toast.error('Please select a hospital');
            return;
        }

        if (formData.practiceType === 'own_clinic') {
            if (!formData.clinicName || !formData.clinicAddress.street || !formData.clinicAddress.city) {
                toast.error('Please fill in all clinic details');
                return;
            }
        }

        if (!formData.licenseNumber || !formData.specialization) {
            toast.error('Please provide license number and specialization');
            return;
        }

        setCreateLoading(true);
        try {
            const doctorData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                practiceType: formData.practiceType,
                licenseNumber: formData.licenseNumber,
                specialization: formData.specialization,
                yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
                qualification: formData.qualification
            };

            if (formData.practiceType === 'hospital') {
                doctorData.hospitalId = formData.hospitalId;
            } else {
                doctorData.clinicName = formData.clinicName;
                doctorData.clinicAddress = formData.clinicAddress;
                doctorData.clinicPhone = formData.clinicPhone;
                doctorData.clinicEmail = formData.clinicEmail;
                doctorData.clinicWebsite = formData.clinicWebsite;
                doctorData.clinicDescription = formData.clinicDescription;
            }

            await doctorApi.createDoctor(doctorData);
            toast.success('Doctor created successfully. Awaiting approval.');
            setOpenDialog(false);
            fetchDoctors(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined,
                filters.specialization !== 'all' ? filters.specialization : undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create doctor');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleViewDoctor = (doctor: any) => {
        setSelectedDoctorId(doctor._id);
        setViewDialogOpen(true);
    };

    const handleEditDoctor = (doctor: any) => {
        setEditingDoctor(doctor);
        setIsEditMode(true);
        // Populate form with doctor data
        setFormData({
            firstName: doctor.firstName || '',
            lastName: doctor.lastName || '',
            email: doctor.email || '',
            password: '', // Don't populate password
            phone: doctor.phone || '',
            dateOfBirth: doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toISOString().split('T')[0] : '',
            gender: doctor.gender || '',
            address: doctor.address || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'UK'
            },
            practiceType: doctor.practiceType || 'hospital',
            hospitalId: typeof doctor.hospitalId === 'object' ? doctor.hospitalId._id : (doctor.hospitalId || hospitalId || user?.hospitalId || ''),
            clinicName: typeof doctor.clinicId === 'object' ? doctor.clinicId.name : '',
            clinicAddress: typeof doctor.clinicId === 'object' ? doctor.clinicId.address : {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'UK'
            },
            clinicPhone: typeof doctor.clinicId === 'object' ? doctor.clinicId.phone : '',
            clinicEmail: typeof doctor.clinicId === 'object' ? doctor.clinicId.email : '',
            clinicWebsite: typeof doctor.clinicId === 'object' ? doctor.clinicId.website : '',
            clinicDescription: typeof doctor.clinicId === 'object' ? doctor.clinicId.description : '',
            licenseNumber: doctor.licenseNumber || '',
            specialization: doctor.specialization || '',
            yearsOfExperience: doctor.yearsOfExperience || 0,
            qualification: doctor.qualification || ''
        });
        setOpenDialog(true);
    };

    const handleDeleteDoctor = (doctor: any) => {
        setDoctorToDelete(doctor);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteDoctor = async () => {
        if (!doctorToDelete) return;
        setDeleteLoading(true);
        try {
            await doctorApi.deleteDoctor(doctorToDelete._id);
            toast.success('Doctor deleted successfully');
            setDeleteDialogOpen(false);
            setDoctorToDelete(null);
            fetchDoctors(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined,
                filters.specialization !== 'all' ? filters.specialization : undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete doctor');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleUpdateDoctor = async () => {
        if (!editingDoctor) return;
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.practiceType === 'hospital' && !formData.hospitalId) {
            toast.error('Please select a hospital');
            return;
        }

        if (formData.practiceType === 'own_clinic') {
            if (!formData.clinicName || !formData.clinicAddress.street || !formData.clinicAddress.city) {
                toast.error('Please fill in all clinic details');
                return;
            }
        }

        if (!formData.licenseNumber || !formData.specialization) {
            toast.error('Please provide license number and specialization');
            return;
        }

        setCreateLoading(true);
        try {
            const doctorData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                practiceType: formData.practiceType,
                licenseNumber: formData.licenseNumber,
                specialization: formData.specialization,
                yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
                qualification: formData.qualification
            };

            if (formData.password) {
                doctorData.password = formData.password;
            }

            if (formData.practiceType === 'hospital') {
                doctorData.hospitalId = formData.hospitalId;
            } else {
                doctorData.clinicName = formData.clinicName;
                doctorData.clinicAddress = formData.clinicAddress;
                doctorData.clinicPhone = formData.clinicPhone;
                doctorData.clinicEmail = formData.clinicEmail;
                doctorData.clinicWebsite = formData.clinicWebsite;
                doctorData.clinicDescription = formData.clinicDescription;
            }

            await doctorApi.updateDoctor(editingDoctor._id, doctorData);
            toast.success('Doctor updated successfully');
            setOpenDialog(false);
            setIsEditMode(false);
            setEditingDoctor(null);
            fetchDoctors(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined,
                filters.specialization !== 'all' ? filters.specialization : undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update doctor');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setIsEditMode(false);
        setEditingDoctor(null);
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
                country: 'UK'
            },
            practiceType: 'hospital',
            hospitalId: hospitalId || user?.hospitalId || '',
            clinicName: '',
            clinicAddress: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'UK'
            },
            clinicPhone: '',
            clinicEmail: '',
            clinicWebsite: '',
            clinicDescription: '',
            licenseNumber: '',
            specialization: '',
            yearsOfExperience: 0,
            qualification: ''
        });
        setOpenDialog(true);
    };

    const specializations = Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)));

    const doctorColumns: TableColumn[] = [
        {
            id: 'name',
            label: 'Doctor',
            minWidth: 200,
            format: (_value, row) => formatAvatar(`Dr. ${row.firstName} ${row.lastName}`, row.profileImage)
        },
        {
            id: 'specialization',
            label: 'Specialization',
            minWidth: 150,
            format: (value) => <Chip label={value || 'N/A'} size="small" />
        },
        {
            id: 'licenseNumber',
            label: 'License',
            minWidth: 120
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
        },
        {
            id: 'yearsOfExperience',
            label: 'Experience',
            minWidth: 100,
            format: (value) => `${value || 0} years`
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 200
        }
    ];

    const doctorActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewDoctor,
            tooltip: 'View Doctor'
        },
        {
            icon: <EditIcon />,
            onClick: handleEditDoctor,
            tooltip: 'Edit Doctor'
        },
        {
            icon: <DeleteIcon />,
            onClick: handleDeleteDoctor,
            color: 'error',
            tooltip: 'Delete Doctor'
        }
    ];

    return (
        <Box>
            {/* Header with Add Button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Doctors</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    Add Doctor
                </Button>
            </Box>

            {/* Filters */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    placeholder="Search doctors..."
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
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Specialization</InputLabel>
                    <Select
                        value={filters.specialization}
                        onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                        label="Specialization"
                    >
                        <MenuItem value="all">All Specializations</MenuItem>
                        {specializations.map((spec) => (
                            <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                        ))}
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
                columns={doctorColumns}
                data={doctors}
                actions={doctorActions}
                loading={loading}
                emptyMessage="No doctors found"
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

            {/* Add/Edit Doctor Dialog */}
            <Dialog open={openDialog} onClose={() => {
                setOpenDialog(false);
                setIsEditMode(false);
                setEditingDoctor(null);
            }} maxWidth="md" fullWidth>
                <DialogTitle>{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <DoctorForm
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
                        setEditingDoctor(null);
                    }} disabled={createLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={isEditMode ? handleUpdateDoctor : handleCreateDoctor}
                        disabled={createLoading}
                        startIcon={createLoading ? <CircularProgress size={20} /> : <AddIcon />}
                    >
                        {createLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Doctor' : 'Create Doctor')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Doctor Dialog */}
            <ViewDoctorDialog
                open={viewDialogOpen}
                onClose={() => {
                    setViewDialogOpen(false);
                    setSelectedDoctorId(null);
                }}
                doctorId={selectedDoctorId}
                onEdit={(doctor) => {
                    setViewDialogOpen(false);
                    handleEditDoctor(doctor);
                }}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDoctorToDelete(null);
                }}
                onConfirm={confirmDeleteDoctor}
                title="Delete Doctor"
                message="This action cannot be undone. The doctor will be permanently removed from the system."
                itemName={doctorToDelete ? `Dr. ${doctorToDelete.firstName} ${doctorToDelete.lastName}` : undefined}
                loading={deleteLoading}
            />
        </Box>
    );
};

export default DoctorsTab;

