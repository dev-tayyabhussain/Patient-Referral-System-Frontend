import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Assessment as AssessmentIcon,
    Assignment as AssignmentIcon,
    CalendarToday as DateIcon,
    MedicalServices as ServiceIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import { recordApi, referralApi } from '../../utils/approvalApi';
import { useAuth } from '../../hooks/useAuth';

interface MedicalRecord {
    _id: string;
    recordId: string;
    visitDate: string;
    visitType: string;
    specialty: string;
    doctor: {
        firstName: string;
        lastName: string;
        specialization?: string;
    };
    hospital: {
        name: string;
        address?: string;
    };
    diagnosis: {
        primary: string;
        secondary: string[];
    };
    treatment: string;
    notes?: string;
    chiefComplaint: string;
}

interface Referral {
    _id: string;
    referralId: string;
    status: string;
    priority: string;
    specialty: string;
    referringHospital?: { name: string };
    referringClinic?: { name: string };
    referringDoctor: { firstName: string, lastName: string };
    receivingHospital: { name: string };
    receivingDoctor?: { firstName: string, lastName: string };
    reason: string;
    createdAt: string;
}

const MedicalRecordsPage: React.FC = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [recordsRes, referralsRes] = await Promise.all([
                recordApi.getRecords({ patient: user?._id }),
                referralApi.getReferrals({ patientId: user?._id })
            ]);

            if (recordsRes.success) {
                setRecords(recordsRes.data.records || []);
            }
            if (referralsRes.success) {
                setReferrals(referralsRes.data.referrals || []);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch medical data');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const data = {
            patient: {
                name: `${user?.firstName} ${user?.lastName}`,
                email: user?.email,
                downloadDate: new Date().toISOString()
            },
            medicalRecords: records,
            referrals: referrals
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medical_records_${user?.firstName}_${user?.lastName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'accepted':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'urgent':
                return 'error';
            case 'high':
                return 'warning';
            case 'medium':
                return 'info';
            default:
                return 'success';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Medical Records & History
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Access your complete medical history, lab results, and referral trackings.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    {/* Medical Records Section */}
                    <Box mb={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h5" fontWeight="600">
                                Recent Visits & Consultations
                            </Typography>
                        </Box>

                        {records.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                                <HistoryIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                <Typography color="text.secondary">
                                    No medical records found.
                                </Typography>
                            </Paper>
                        ) : (
                            records.map((record) => (
                                <Accordion key={record._id} sx={{ mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="600">
                                                    {record.specialty} Consultation
                                                </Typography>
                                                <Box display="flex" alignItems="center" mt={0.5}>
                                                    <DateIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(record.visitDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip
                                                label={record.visitType}
                                                size="small"
                                                variant="outlined"
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ pt: 0 }}>
                                        <Divider sx={{ mb: 2 }} />
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" color="text.secondary" display="block">Doctor</Typography>
                                                <Typography variant="body2" fontWeight="500">
                                                    Dr. {record.doctor?.firstName} {record.doctor?.lastName}
                                                </Typography>
                                                {record.doctor?.specialization && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {record.doctor.specialization}
                                                    </Typography>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" color="text.secondary" display="block">Facility</Typography>
                                                <Typography variant="body2" fontWeight="500">
                                                    {record.hospital?.name || 'Unknown Facility'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="text.secondary" display="block">Chief Complaint</Typography>
                                                <Typography variant="body2">{record.chiefComplaint}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="text.secondary" display="block">Primary Diagnosis</Typography>
                                                <Typography variant="body2" fontWeight="600" color="primary">
                                                    {record.diagnosis.primary}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="text.secondary" display="block">Treatment Plan</Typography>
                                                <Typography variant="body2">{record.treatment}</Typography>
                                            </Grid>
                                            {record.notes && (
                                                <Grid item xs={12}>
                                                    <Typography variant="caption" color="text.secondary" display="block">Doctor's Notes</Typography>
                                                    <Typography variant="body2" fontStyle="italic">{record.notes}</Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        )}
                    </Box>

                    {/* Referral History Section */}
                    <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                            <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h5" fontWeight="600">
                                Referral Tracking
                            </Typography>
                        </Box>

                        {referrals.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                                <Typography color="text.secondary">
                                    No referral history found.
                                </Typography>
                            </Paper>
                        ) : (
                            referrals.map((referral) => (
                                <Accordion key={referral._id} sx={{ mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="600">
                                                    {referral.specialty} Referral
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Ref ID: {referral.referralId} • {new Date(referral.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" gap={1}>
                                                <Chip
                                                    label={referral.priority}
                                                    size="small"
                                                    color={getPriorityColor(referral.priority) as any}
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                                <Chip
                                                    label={referral.status}
                                                    size="small"
                                                    variant="outlined"
                                                    color={getStatusColor(referral.status) as any}
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ pt: 0 }}>
                                        <Divider sx={{ mb: 2 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" color="text.secondary" display="block">From</Typography>
                                                <Typography variant="body2">
                                                    {referral.referringHospital?.name || referral.referringClinic?.name || 'Unknown Facility'}
                                                </Typography>
                                                <Typography variant="caption">
                                                    Dr. {referral.referringDoctor?.firstName} {referral.referringDoctor?.lastName}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" color="text.secondary" display="block">To</Typography>
                                                <Typography variant="body2">
                                                    {referral.receivingHospital?.name || 'Unknown Facility'}
                                                </Typography>
                                                {referral.receivingDoctor && (
                                                    <Typography variant="caption">
                                                        Dr. {referral.receivingDoctor.firstName} {referral.receivingDoctor.lastName}
                                                    </Typography>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="text.secondary" display="block">Reason for Referral</Typography>
                                                <Typography variant="body2">{referral.reason}</Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={2}>
                                Quick Stats
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="text.secondary">Total Visits</Typography>
                                    <Typography variant="subtitle2" fontWeight="bold">{records.length}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="text.secondary">Active Referrals</Typography>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {referrals.filter(r => r.status === 'pending').length}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<ServiceIcon />}
                                sx={{ mb: 1 }}
                                onClick={handleDownload}
                            >
                                Download All Records
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MedicalRecordsPage;
