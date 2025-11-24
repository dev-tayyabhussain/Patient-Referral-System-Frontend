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
import { patientApi } from '../../utils/approvalApi';
import { formatStatus } from '../dashboard/DataTable';

interface ViewPatientDialogProps {
    open: boolean;
    onClose: () => void;
    patientId: string | null;
    onEdit?: (patient: any) => void;
}

const ViewPatientDialog: React.FC<ViewPatientDialogProps> = ({ open, onClose, patientId, onEdit }) => {
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && patientId) {
            fetchPatient();
        } else {
            setPatient(null);
            setError(null);
        }
    }, [open, patientId]);

    const fetchPatient = async () => {
        if (!patientId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await patientApi.getPatientProfile(patientId);
            if (response.success) {
                setPatient(response.data);
            } else {
                setError('Failed to fetch patient details');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch patient details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Patient Details</Typography>
                    {patient && (
                        <Chip
                            label={formatStatus(patient.approvalStatus, {
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
                ) : patient ? (
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">First Name</Typography>
                                <Typography variant="body1">{patient.firstName || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Last Name</Typography>
                                <Typography variant="body1">{patient.lastName || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                <Typography variant="body1">{patient.email || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                <Typography variant="body1">{patient.phone || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                                <Typography variant="body1">
                                    {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                                <Typography variant="body1">{patient.gender || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Blood Type</Typography>
                                <Typography variant="body1">{patient.bloodType || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Hospital</Typography>
                                <Typography variant="body1">
                                    {patient.hospitalId && typeof patient.hospitalId === 'object' ? patient.hospitalId.name : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Emergency Contact</Typography>
                                <Typography variant="body1">{patient.emergencyContact || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Emergency Phone</Typography>
                                <Typography variant="body1">{patient.emergencyPhone || 'N/A'}</Typography>
                            </Grid>
                            {patient.allergies && patient.allergies.length > 0 && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Allergies</Typography>
                                        <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                                            {patient.allergies.map((allergy: string, index: number) => (
                                                <Chip key={index} label={allergy} size="small" />
                                            ))}
                                        </Box>
                                    </Grid>
                                </>
                            )}
                            {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Chronic Conditions</Typography>
                                        <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                                            {patient.chronicConditions.map((condition: string, index: number) => (
                                                <Chip key={index} label={condition} size="small" color="warning" />
                                            ))}
                                        </Box>
                                    </Grid>
                                </>
                            )}
                            {patient.address && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                        <Typography variant="body1">
                                            {patient.address.street || ''} {patient.address.city || ''} {patient.address.state || ''} {patient.address.zipCode || ''}
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
                {patient && onEdit && (
                    <Button variant="contained" onClick={() => onEdit(patient)}>
                        Edit
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ViewPatientDialog;

