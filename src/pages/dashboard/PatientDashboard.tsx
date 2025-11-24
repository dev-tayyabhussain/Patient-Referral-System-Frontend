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
    Edit as EditIcon,
    Visibility as ViewIcon,
    Schedule as ScheduleIcon,
    Assignment as AssignmentIcon,
    CalendarToday as CalendarIcon,
    Description as DescriptionIcon,
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
import { formatStatus, formatAvatar, formatDateTime } from '../../components/dashboard/DataTable';

const PatientDashboard: React.FC = () => {
    const { user } = useAuth();
    const { data, loading, error } = useDashboardData('patient');
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'appointment' | 'record' | 'referral'>('appointment');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type: 'appointment' | 'record' | 'referral') => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleViewAppointment = (appointment: any) => {
        console.log('View appointment:', appointment);
        // Implement view appointment logic
    };

    const handleEditAppointment = (appointment: any) => {
        console.log('Edit appointment:', appointment);
        // Implement edit appointment logic
    };

    const handleViewRecord = (record: any) => {
        console.log('View record:', record);
        // Implement view record logic
    };

    const handleViewReferral = (referral: any) => {
        console.log('View referral:', referral);
        // Implement view referral logic
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
            title: 'Next Appointment',
            value: data.stats?.nextAppointment ? formatDateTime(data.stats.nextAppointment) : 'Not scheduled',
            subtitle: `with ${data.stats?.primaryDoctor || 'Dr. Unknown'}`,
            icon: <ScheduleIcon />,
            color: 'primary' as const
        },
        {
            title: 'Upcoming',
            value: data.stats?.upcomingAppointments || 0,
            subtitle: 'appointments scheduled',
            icon: <CalendarIcon />,
            color: 'primary' as const
        },
        {
            title: 'Referrals',
            value: data.stats?.completedReferrals || 0,
            subtitle: `${data.stats?.pendingReferrals || 0} pending`,
            icon: <AssignmentIcon />,
            color: 'primary' as const
        },
        {
            title: 'Records',
            value: data.stats?.medicalRecords || 0,
            subtitle: 'medical records',
            icon: <DescriptionIcon />,
            color: 'primary' as const
        }
    ];

    // Prepare appointment table columns
    const appointmentColumns: TableColumn[] = [
        {
            id: 'dateTime',
            label: 'Date & Time',
            minWidth: 150,
            format: (value, _row) => (
                <Box>
                    <Typography variant="subtitle2">{formatDateTime(value || _row.date || _row.createdAt)}</Typography>
                </Box>
            )
        },
        {
            id: 'doctor',
            label: 'Doctor',
            minWidth: 200,
            format: (value, _row) => formatAvatar(value, _row.doctorImage)
        },
        {
            id: 'specialty',
            label: 'Specialty',
            minWidth: 120,
            format: (value) => <Chip label={value} size="small" />
        },
        {
            id: 'type',
            label: 'Type',
            minWidth: 120,
            format: (value) => <Chip label={value} size="small" />
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'Scheduled': 'success',
                'Completed': 'info',
                'Cancelled': 'error'
            })
        },
        {
            id: 'location',
            label: 'Location',
            minWidth: 150
        }
    ];

    // Prepare appointment table actions
    const appointmentActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewAppointment,
            tooltip: 'View Appointment'
        },
        {
            icon: <EditIcon />,
            onClick: handleEditAppointment,
            tooltip: 'Edit Appointment'
        }
    ];

    // Prepare medical record table columns
    const recordColumns: TableColumn[] = [
        {
            id: 'date',
            label: 'Date',
            minWidth: 120,
            format: (value) => formatDateTime(value)
        },
        {
            id: 'doctor',
            label: 'Doctor',
            minWidth: 200,
            format: (value, _row) => formatAvatar(value, _row.doctorImage)
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
            minWidth: 150
        },
        {
            id: 'treatment',
            label: 'Treatment',
            minWidth: 200
        },
        {
            id: 'attachments',
            label: 'Attachments',
            minWidth: 150,
            format: (value) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {value?.map((attachment: string, index: number) => (
                        <Chip
                            key={index}
                            label={attachment}
                            size="small"
                            variant="outlined"
                        />
                    ))}
                </Box>
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
            id: 'fromDoctor',
            label: 'From Doctor',
            minWidth: 200,
            format: (value) => value ? `Dr. ${value.firstName} ${value.lastName}` : 'N/A'
        },
        {
            id: 'toHospital',
            label: 'To Hospital',
            minWidth: 150,
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
                'High': 'error',
                'Medium': 'warning',
                'Low': 'success'
            })
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'Completed': 'success',
                'Approved': 'info',
                'Pending': 'warning',
                'Rejected': 'error'
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
            label: 'Appointments',
            content: (
                <DataTable
                    columns={appointmentColumns}
                    data={data.appointments || []}
                    actions={appointmentActions}
                    loading={loading}
                    emptyMessage="No appointments found"
                />
            ),
            actionButton: {
                label: 'Book Appointment',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('appointment')
            }
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
            label: 'Referrals',
            content: (
                <DataTable
                    columns={referralColumns}
                    data={data.referrals || []}
                    actions={referralActions}
                    loading={loading}
                    emptyMessage="No referrals found"
                />
            ),
            actionButton: {
                label: 'Request Referral',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('referral')
            }
        },
        {
            label: 'Health Summary',
            content: (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ActivityFeed
                        activities={data.activities || []}
                        loading={loading}
                        title="Health Activities"
                        maxItems={5}
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
                    {dialogType === 'appointment' && 'Book Appointment'}
                    {dialogType === 'record' && 'Request Medical Record'}
                    {dialogType === 'referral' && 'Request Referral'}
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
        </Container>
    );
};

export default PatientDashboard;
