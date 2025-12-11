import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Button,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Visibility as ViewIcon,
    Assignment as AssignmentIcon,
    Description as DescriptionIcon,
    TrendingUp as TrendingUpIcon,
    LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardData } from '../../hooks/useDashboardData';
import {
    StatsGrid,
    DataTable,
    ActivityFeed,
    DashboardTabs,
    TableColumn,
    TableAction
} from '../../components/dashboard';
import { formatStatus, formatDateTime } from '../../components/dashboard/DataTable';

const PatientDashboard: React.FC = () => {
    const { user } = useAuth();
    const { data, loading, error } = useDashboardData('patient');
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'record'>('record');
    const [selectedReferral, setSelectedReferral] = useState<any>(null);
    const [viewReferralOpen, setViewReferralOpen] = useState(false);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type: 'record') => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleViewRecord = (record: any) => {
        console.log('View record:', record);
        // Implement view record logic
    };

    const handleViewReferral = (referral: any) => {
        setSelectedReferral(referral);
        setViewReferralOpen(true);
    };

    const handleCloseReferralView = () => {
        setViewReferralOpen(false);
        setSelectedReferral(null);
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading dashboard...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!data) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="warning">
                    No data available
                </Alert>
            </Container>
        );
    }

    // Prepare stats for StatsGrid
    const statsData = [
        {
            title: 'Total Referrals',
            value: data.stats?.totalReferrals || 0,
            subtitle: data.stats?.nextAppointment
                ? `Next: ${formatDateTime(data.stats.nextAppointment).split(',')[0]} at ${data.stats?.nextAppointmentHospital || 'Hospital'}`
                : `${data.stats?.activeReferrals || 0} active`,
            icon: <AssignmentIcon />,
            color: 'primary' as const
        },
        {
            title: 'Pending Referrals',
            value: data.stats?.pendingReferrals || 0,
            subtitle: 'awaiting response',
            icon: <TrendingUpIcon />,
            color: 'warning' as const
        },
        {
            title: 'Completed Referrals',
            value: data.stats?.completedReferrals || 0,
            subtitle: 'successfully completed',
            icon: <LocalHospitalIcon />,
            color: 'success' as const
        },
        {
            title: 'Medical Records',
            value: data.stats?.totalRecords || 0,
            subtitle: 'total records',
            icon: <DescriptionIcon />,
            color: 'info' as const
        }
    ];

    // Prepare medical record table columns
    const recordColumns: TableColumn[] = [
        {
            id: 'visitDate',
            label: 'Date',
            minWidth: 120,
            format: (value) => formatDateTime(value)
        },
        {
            id: 'doctor',
            label: 'Doctor',
            minWidth: 200,
            format: (value) => value ? `Dr. ${value.firstName} ${value.lastName}` : 'N/A'
        },
        {
            id: 'specialty',
            label: 'Specialty',
            minWidth: 120,
            format: (value) => <Chip label={value} size="small" />
        },
        {
            id: 'diagnosis',
            label: 'Diagnosis',
            minWidth: 150,
            format: (value) => value?.primary || 'N/A'
        },
        {
            id: 'treatment',
            label: 'Treatment',
            minWidth: 200
        },
        {
            id: 'attachments',
            label: 'Files',
            minWidth: 100,
            format: (value) => (
                <Chip
                    label={`${value?.length || 0} files`}
                    size="small"
                    variant="outlined"
                    color={value?.length > 0 ? 'primary' : 'default'}
                />
            )
        }
    ];

    // Prepare medical record table actions
    const recordActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewRecord,
            tooltip: 'View Record'
        }
    ];

    // Prepare referral table columns
    const referralColumns: TableColumn[] = [
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 120,
            format: (value) => formatDateTime(value)
        },
        {
            id: 'referringDoctor',
            label: 'From Doctor',
            minWidth: 200,
            format: (value) => value ? `Dr. ${value.firstName} ${value.lastName}` : 'N/A'
        },
        {
            id: 'receivingHospital',
            label: 'To Hospital',
            minWidth: 180,
            format: (value) => value?.name || 'N/A'
        },
        {
            id: 'specialty',
            label: 'Specialty',
            minWidth: 120,
            format: (value) => <Chip label={value} size="small" />
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
                'accepted': 'info',
                'pending': 'warning',
                'rejected': 'error',
                'cancelled': 'default'
            })
        }
    ];

    // Prepare referral table actions
    const referralActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewReferral,
            tooltip: 'View Referral'
        }
    ];

    // Prepare tab configurations
    const tabConfigs = [
        {
            label: 'Referrals',
            content: (
                <DataTable
                    columns={referralColumns}
                    data={data.referrals || []}
                    actions={referralActions}
                    loading={loading}
                    emptyMessage="No referrals found"
                />
            )
        },
        {
            label: 'Medical Records',
            content: (
                <DataTable
                    columns={recordColumns}
                    data={data.records || []}
                    actions={recordActions}
                    loading={loading}
                    emptyMessage="No medical records found"
                />
            ),
            actionButton: {
                label: 'Request Record',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('record')
            }
        },
        {
            label: 'Health Summary',
            content: (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ActivityFeed
                        activities={data.activities || []}
                        loading={loading}
                        title="Recent Activities"
                        maxItems={10}
                        sx={{ flex: 1 }}
                    />
                </Box>
            )
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Patient Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Welcome back, {user?.firstName} {user?.lastName} • {data.stats?.age || 0} years old, {data.stats?.gender || 'Unknown'}
                </Typography>
            </Box>

            {/* Quick Stats */}
            <StatsGrid
                stats={statsData}
                loading={loading}
                sx={{ mb: 4 }}
            />

            {/* Main Content Tabs */}
            <DashboardTabs
                tabs={tabConfigs}
                value={tabValue}
                onChange={handleTabChange}
                loading={loading}
            />

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === 'record' && 'Request Medical Record'}
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        This dialog will be implemented with proper form fields based on the selected type.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleCloseDialog}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Referral View Modal */}
            <Dialog open={viewReferralOpen} onClose={handleCloseReferralView} maxWidth="md" fullWidth>
                <DialogTitle>
                    Referral Details
                    {selectedReferral && (
                        <Chip
                            label={selectedReferral.status}
                            size="small"
                            sx={{ ml: 2 }}
                            color={
                                selectedReferral.status === 'completed' ? 'success' :
                                    selectedReferral.status === 'accepted' ? 'info' :
                                        selectedReferral.status === 'pending' ? 'warning' : 'error'
                            }
                        />
                    )}
                </DialogTitle>
                <DialogContent>
                    {selectedReferral && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>Referral Information</Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary">Referral ID</Typography>
                                <Typography variant="body1">{selectedReferral.referralId || 'N/A'}</Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary">From Doctor</Typography>
                                <Typography variant="body1">
                                    {selectedReferral.referringDoctor
                                        ? `Dr. ${selectedReferral.referringDoctor.firstName} ${selectedReferral.referringDoctor.lastName} - ${selectedReferral.referringDoctor.specialization}`
                                        : 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary">To Hospital</Typography>
                                <Typography variant="body1">
                                    {selectedReferral.receivingHospital?.name || 'N/A'}
                                </Typography>
                                {selectedReferral.receivingHospital?.address && (
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedReferral.receivingHospital.address.street}, {selectedReferral.receivingHospital.address.city}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary">Specialty & Priority</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                    <Chip label={selectedReferral.specialty} size="small" />
                                    <Chip
                                        label={selectedReferral.priority}
                                        size="small"
                                        color={
                                            selectedReferral.priority === 'urgent' || selectedReferral.priority === 'high' ? 'error' :
                                                selectedReferral.priority === 'medium' ? 'warning' : 'success'
                                        }
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary">Reason for Referral</Typography>
                                <Typography variant="body1">{selectedReferral.reason || 'N/A'}</Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary">Chief Complaint</Typography>
                                <Typography variant="body1">{selectedReferral.chiefComplaint || 'N/A'}</Typography>
                            </Box>

                            {selectedReferral.appointment?.scheduledDate && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary">Appointment</Typography>
                                    <Typography variant="body1">
                                        {formatDateTime(selectedReferral.appointment.scheduledDate)}
                                    </Typography>
                                    {selectedReferral.appointment.location && (
                                        <Typography variant="body2" color="text.secondary">
                                            Location: {selectedReferral.appointment.location}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">Created</Typography>
                                <Typography variant="body1">{formatDateTime(selectedReferral.createdAt)}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReferralView}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PatientDashboard;
