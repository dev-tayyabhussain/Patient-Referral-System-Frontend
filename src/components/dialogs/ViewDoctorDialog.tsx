import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Chip,
    Box,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import { doctorApi } from '../../utils/approvalApi';
import { formatStatus } from '../dashboard/DataTable';

interface ViewDoctorDialogProps {
    open: boolean;
    onClose: () => void;
    doctorId: string | null;
    onEdit?: (doctor: any) => void;
}

const ViewDoctorDialog: React.FC<ViewDoctorDialogProps> = ({ open, onClose, doctorId, onEdit }) => {
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && doctorId) {
            fetchDoctor();
        } else {
            setDoctor(null);
            setError(null);
        }
    }, [open, doctorId]);

    const fetchDoctor = async () => {
        if (!doctorId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await doctorApi.getDoctorById(doctorId);
            if (response.success) {
                setDoctor(response.data);
            } else {
                setError('Failed to fetch doctor details');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch doctor details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Doctor Details</Typography>
                    {doctor && (
                        <Chip
                            label={formatStatus(doctor.approvalStatus, {
                                'approved': 'success',
                                'pending': 'warning',
                                'rejected': 'error'
                            })}
                            size="small"
                        />
                    )}
                </Box>
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : doctor ? (
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">First Name</Typography>
                                <Typography variant="body1">{doctor.firstName || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Last Name</Typography>
                                <Typography variant="body1">{doctor.lastName || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                <Typography variant="body1">{doctor.email || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                <Typography variant="body1">{doctor.phone || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                                <Typography variant="body1">
                                    {doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toLocaleDateString() : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                                <Typography variant="body1">{doctor.gender || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">License Number</Typography>
                                <Typography variant="body1">{doctor.licenseNumber || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Specialization</Typography>
                                <Typography variant="body1">{doctor.specialization || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Years of Experience</Typography>
                                <Typography variant="body1">{doctor.yearsOfExperience || 0} years</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Qualification</Typography>
                                <Typography variant="body1">{doctor.qualification || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Practice Type</Typography>
                                <Typography variant="body1">{doctor.practiceType || 'N/A'}</Typography>
                            </Grid>
                            {doctor.hospitalId && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Hospital</Typography>
                                    <Typography variant="body1">
                                        {typeof doctor.hospitalId === 'object' ? doctor.hospitalId.name : 'N/A'}
                                    </Typography>
                                </Grid>
                            )}
                            {doctor.clinicId && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Clinic</Typography>
                                    <Typography variant="body1">
                                        {typeof doctor.clinicId === 'object' ? doctor.clinicId.name : 'N/A'}
                                    </Typography>
                                </Grid>
                            )}
                            {doctor.address && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                        <Typography variant="body1">
                                            {doctor.address.street || ''} {doctor.address.city || ''} {doctor.address.state || ''} {doctor.address.zipCode || ''}
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                {doctor && onEdit && (
                    <Button variant="contained" onClick={() => onEdit(doctor)}>
                        Edit
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ViewDoctorDialog;

