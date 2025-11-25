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
import { referralApi } from '../../utils/approvalApi';

interface ViewReferralDialogProps {
    open: boolean;
    onClose: () => void;
    referralId: string | null;
    onEdit?: (referral: any) => void;
}

const ViewReferralDialog: React.FC<ViewReferralDialogProps> = ({ open, onClose, referralId, onEdit }) => {
    const [referral, setReferral] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && referralId) {
            fetchReferral();
        } else {
            setReferral(null);
            setError(null);
        }
    }, [open, referralId]);

    const fetchReferral = async () => {
        if (!referralId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await referralApi.getReferralById(referralId);
            if (response.success) {
                setReferral(response.data);
            } else {
                setError('Failed to fetch referral details');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch referral details');
        } finally {
            setLoading(false);
        }
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Referral Details</Typography>
                    {referral && (
                        <Box display="flex" gap={1}>
                            <Chip
                                label={referral.status || 'N/A'}
                                color={getStatusColor(referral.status) as any}
                                size="small"
                            />
                            <Chip
                                label={referral.priority || 'N/A'}
                                color={getPriorityColor(referral.priority) as any}
                                size="small"
                            />
                        </Box>
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
                ) : referral ? (
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Referral ID</Typography>
                                <Typography variant="body1">{referral.referralId || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Specialty</Typography>
                                <Typography variant="body1">{referral.specialty || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                                <Typography variant="body1">
                                    {referral.patient ? `${referral.patient.firstName} ${referral.patient.lastName}` : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Created Date</Typography>
                                <Typography variant="body1">
                                    {referral.createdAt ? new Date(referral.createdAt).toLocaleDateString() : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Referring Doctor</Typography>
                                <Typography variant="body1">
                                    {referral.referringDoctor ? `Dr. ${referral.referringDoctor.firstName} ${referral.referringDoctor.lastName}` : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Referring Hospital</Typography>
                                <Typography variant="body1">
                                    {referral.referringHospital?.name || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Receiving Doctor</Typography>
                                <Typography variant="body1">
                                    {referral.receivingDoctor ? `Dr. ${referral.receivingDoctor.firstName} ${referral.receivingDoctor.lastName}` : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Receiving Hospital</Typography>
                                <Typography variant="body1">
                                    {referral.receivingHospital?.name || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">Reason</Typography>
                                <Typography variant="body1">{referral.reason || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">Chief Complaint</Typography>
                                <Typography variant="body1">{referral.chiefComplaint || 'N/A'}</Typography>
                            </Grid>
                            {referral.historyOfPresentIllness && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">History of Present Illness</Typography>
                                    <Typography variant="body1">{referral.historyOfPresentIllness}</Typography>
                                </Grid>
                            )}
                            {referral.physicalExamination && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Physical Examination</Typography>
                                    <Typography variant="body1">{referral.physicalExamination}</Typography>
                                </Grid>
                            )}
                            {referral.diagnosis && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Diagnosis</Typography>
                                    <Typography variant="body1">
                                        {typeof referral.diagnosis === 'object' 
                                            ? (referral.diagnosis.primary || 'N/A')
                                            : (referral.diagnosis || 'N/A')
                                        }
                                    </Typography>
                                    {typeof referral.diagnosis === 'object' && 
                                     referral.diagnosis.secondary && 
                                     referral.diagnosis.secondary.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary">Secondary:</Typography>
                                            <Typography variant="body2">
                                                {referral.diagnosis.secondary.join(', ')}
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                            )}
                            {referral.treatmentPlan && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Treatment Plan</Typography>
                                    <Typography variant="body1">{referral.treatmentPlan}</Typography>
                                </Grid>
                            )}
                            {referral.notes && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                                    <Typography variant="body1">{referral.notes}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                {referral && onEdit && (
                    <Button variant="contained" onClick={() => onEdit(referral)}>
                        Edit
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ViewReferralDialog;

