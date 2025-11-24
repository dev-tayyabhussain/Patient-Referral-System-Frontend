import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
    Pagination,
    Stack,
    Grid,
    Avatar,
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { approvalApi } from '../../utils/approvalApi';
import { PendingUser } from '../../types/hospital';

const DoctorApprovalPage: React.FC = () => {
    const [pendingDoctors, setPendingDoctors] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<PendingUser | null>(null);
    const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | null>(null);
    const [message, setMessage] = useState('');
    const [reason, setReason] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDoctors, setTotalDoctors] = useState(0);

    const loadPendingDoctors = async () => {
        try {
            setLoading(true);
            const response = await approvalApi.getPendingDoctors({
                page: currentPage,
                limit: 10,
            });
            setPendingDoctors(response.data.doctors);
            setTotalPages(response.data.pagination.pages);
            setTotalDoctors(response.data.pagination.total);
        } catch (error) {
            console.error('Error loading pending doctors:', error);
            toast.error('Failed to load pending doctors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingDoctors();
    }, [currentPage]);

    const handleApprove = async () => {
        if (!selectedDoctor) return;

        try {
            await approvalApi.approveUser(selectedDoctor._id, message);
            toast.success('Doctor approved successfully');
            setActionDialog(null);
            setMessage('');
            setSelectedDoctor(null);
            loadPendingDoctors();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve doctor');
        }
    };

    const handleReject = async () => {
        if (!selectedDoctor || !reason.trim()) return;

        try {
            await approvalApi.rejectUser(selectedDoctor._id, reason);
            toast.success('Doctor rejected successfully');
            setActionDialog(null);
            setReason('');
            setSelectedDoctor(null);
            loadPendingDoctors();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject doctor');
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Doctor Approval Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Review and approve pending doctor registrations for your hospital
                </Typography>
            </Box>

            {/* Stats Card */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Pending Doctors
                                    </Typography>
                                    <Typography variant="h4" color="warning.main">
                                        {totalDoctors}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ width: '100%' }}>
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Pending Doctor Approvals</Typography>
                        <IconButton onClick={loadPendingDoctors} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : pendingDoctors.length === 0 ? (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            No pending doctor approvals at this time.
                        </Alert>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Doctor</TableCell>
                                            <TableCell>Contact</TableCell>
                                            <TableCell>Specialization</TableCell>
                                            <TableCell>Experience</TableCell>
                                            <TableCell>License</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Applied</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pendingDoctors.map((doctor) => (
                                            <TableRow key={doctor._id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                            {getInitials(doctor.firstName, doctor.lastName)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2">
                                                                {doctor.firstName} {doctor.lastName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {doctor.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {doctor.phone || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={doctor.specialization || 'Not specified'}
                                                        color="info"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {doctor.yearsOfExperience ? `${doctor.yearsOfExperience} years` : 'Not specified'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                        {doctor.licenseNumber || 'Not provided'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={doctor.approvalStatus}
                                                        color="warning"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {new Date(doctor.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="Approve Doctor">
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() => {
                                                                    setSelectedDoctor(doctor);
                                                                    setActionDialog('approve');
                                                                }}
                                                            >
                                                                <ApproveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Reject Doctor">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => {
                                                                    setSelectedDoctor(doctor);
                                                                    setActionDialog('reject');
                                                                }}
                                                            >
                                                                <RejectIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={(_, page) => setCurrentPage(page)}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Paper>

            {/* Action Dialog */}
            <Dialog
                open={actionDialog !== null}
                onClose={() => {
                    setActionDialog(null);
                    setMessage('');
                    setReason('');
                    setSelectedDoctor(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {actionDialog === 'approve' ? 'Approve' : 'Reject'} Doctor
                </DialogTitle>
                <DialogContent>
                    {selectedDoctor && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Doctor: {selectedDoctor.firstName} {selectedDoctor.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: {selectedDoctor.email}
                            </Typography>
                            {selectedDoctor.specialization && (
                                <Typography variant="body2" color="text.secondary">
                                    Specialization: {selectedDoctor.specialization}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {actionDialog === 'approve' ? (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Approval Message (Optional)"
                            fullWidth
                            multiline
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter a welcome message for the doctor..."
                        />
                    ) : (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Rejection Reason"
                            fullWidth
                            multiline
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter the reason for rejection..."
                            required
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setActionDialog(null);
                            setMessage('');
                            setReason('');
                            setSelectedDoctor(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={actionDialog === 'approve' ? handleApprove : handleReject}
                        color={actionDialog === 'approve' ? 'success' : 'error'}
                        variant="contained"
                        disabled={actionDialog === 'reject' && !reason.trim()}
                    >
                        {actionDialog === 'approve' ? 'Approve' : 'Reject'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DoctorApprovalPage;
