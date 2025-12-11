import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Grid,
    Avatar,
    Menu,
    ListItemIcon,
    ListItemText,
    Badge,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Schedule as ScheduleIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon,
} from '@mui/icons-material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`appointments-tabpanel-${index}`}
            aria-labelledby={`appointments-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const AppointmentsPage: React.FC = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);

    // Mock data
    const [appointments, setAppointments] = useState([
        {
            id: '1',
            patientName: 'John Smith',
            patientId: 'P001',
            date: '2025-01-16',
            time: '09:00 AM',
            type: 'Follow-up',
            status: 'Scheduled',
            duration: 30,
            notes: 'Blood pressure check',
            phone: '+1-555-0123',
            email: 'john.smith@example.com',
        },
        {
            id: '2',
            patientName: 'Jane Doe',
            patientId: 'P002',
            date: '2025-01-16',
            time: '10:30 AM',
            type: 'Consultation',
            status: 'Scheduled',
            duration: 45,
            notes: 'ECG review and consultation',
            phone: '+1-555-0124',
            email: 'jane.doe@example.com',
        },
        {
            id: '3',
            patientName: 'Alice Johnson',
            patientId: 'P003',
            date: '2025-01-16',
            time: '02:00 PM',
            type: 'New Patient',
            status: 'Scheduled',
            duration: 60,
            notes: 'Initial consultation and examination',
            phone: '+1-555-0125',
            email: 'alice.johnson@example.com',
        },
        {
            id: '4',
            patientName: 'Bob Wilson',
            patientId: 'P004',
            date: '2025-01-15',
            time: '11:00 AM',
            type: 'Follow-up',
            status: 'Completed',
            duration: 30,
            notes: 'Routine checkup - all vitals normal',
            phone: '+1-555-0126',
            email: 'bob.wilson@example.com',
        },
        {
            id: '5',
            patientName: 'Carol Brown',
            patientId: 'P005',
            date: '2025-01-15',
            time: '03:30 PM',
            type: 'Consultation',
            status: 'Cancelled',
            duration: 45,
            notes: 'Patient cancelled due to emergency',
            phone: '+1-555-0127',
            email: 'carol.brown@example.com',
        },
    ]);

    const appointmentTypes = ['New Patient', 'Follow-up', 'Consultation', 'Emergency', 'Procedure'];
    const appointmentStatuses = ['Scheduled', 'Completed', 'Cancelled', 'No Show', 'Rescheduled'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return 'primary';
            case 'Completed':
                return 'success';
            case 'Cancelled':
                return 'error';
            case 'No Show':
                return 'warning';
            case 'Rescheduled':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return <ScheduleIcon />;
            case 'Completed':
                return <CheckIcon />;
            case 'Cancelled':
                return <CancelIcon />;
            case 'No Show':
                return <PendingIcon />;
            case 'Rescheduled':
                return <ScheduleIcon />;
            default:
                return <ScheduleIcon />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'New Patient':
                return 'success';
            case 'Follow-up':
                return 'primary';
            case 'Consultation':
                return 'info';
            case 'Emergency':
                return 'error';
            case 'Procedure':
                return 'warning';
            default:
                return 'default';
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.notes.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const todayAppointments = filteredAppointments.filter(apt => apt.date === '2025-01-16');
    const upcomingAppointments = filteredAppointments.filter(apt => apt.date > '2025-01-16');
    const pastAppointments = filteredAppointments.filter(apt => apt.date < '2025-01-16');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type: 'add' | 'edit', appointment?: any) => {
        setDialogType(type);
        setSelectedAppointment(appointment || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAppointment(null);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedAppointment(appointment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAppointment(null);
    };

    const handleDeleteAppointment = (appointmentId: string) => {
        setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
        handleMenuClose();
    };

    const handleUpdateStatus = (appointmentId: string, newStatus: string) => {
        setAppointments(appointments.map(appointment =>
            appointment.id === appointmentId
                ? { ...appointment, status: newStatus }
                : appointment
        ));
        handleMenuClose();
    };

    const renderAppointmentsTable = (appointmentsList: any[]) => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Patient</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {appointmentsList.map((appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                        <PersonIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2">
                                            {appointment.patientName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {appointment.patientId}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box>
                                    <Typography variant="subtitle2">
                                        {appointment.date}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {appointment.time}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={appointment.type}
                                    color={getTypeColor(appointment.type) as any}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={appointment.status}
                                    color={getStatusColor(appointment.status) as any}
                                    size="small"
                                    icon={getStatusIcon(appointment.status)}
                                />
                            </TableCell>
                            <TableCell>{appointment.duration} min</TableCell>
                            <TableCell>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                    {appointment.notes}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={(e) => handleMenuOpen(e, appointment)}
                                    size="small"
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Appointment Management
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {user?.role === 'hospital'
                        ? 'View and manage appointments for all doctors in your hospital'
                        : user?.role === 'doctor'
                            ? 'Manage your patient appointments and schedule'
                            : 'View and manage your appointments'}
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Today's Appointments</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {todayAppointments.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {todayAppointments.filter(apt => apt.status === 'Scheduled').length} scheduled
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Upcoming</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {upcomingAppointments.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Future appointments
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CheckIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Completed</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {appointments.filter(apt => apt.status === 'Completed').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This week
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TimeIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Total Hours</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {appointments.reduce((sum, apt) => sum + apt.duration, 0) / 60}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hours scheduled
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters and Actions */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                            sx={{ minWidth: 250 }}
                        />
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel>Filter by Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Filter by Status"
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                {appointmentStatuses.map(status => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ flexGrow: 1 }} />
                        {user?.role !== 'hospital' && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('add')}
                            >
                                Schedule Appointment
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Appointments Tabs */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="appointments tabs">
                        <Tab label={`Today (${todayAppointments.length})`} />
                        <Tab label={`Upcoming (${upcomingAppointments.length})`} />
                        <Tab label={`Past (${pastAppointments.length})`} />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    {todayAppointments.length > 0 ? (
                        renderAppointmentsTable(todayAppointments)
                    ) : (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No appointments scheduled for today
                            </Typography>
                        </Box>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    {upcomingAppointments.length > 0 ? (
                        renderAppointmentsTable(upcomingAppointments)
                    ) : (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No upcoming appointments
                            </Typography>
                        </Box>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    {pastAppointments.length > 0 ? (
                        renderAppointmentsTable(pastAppointments)
                    ) : (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <CheckIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No past appointments
                            </Typography>
                        </Box>
                    )}
                </TabPanel>
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleOpenDialog('edit', selectedAppointment)}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit Appointment</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleUpdateStatus(selectedAppointment?.id, 'Completed')}>
                    <ListItemIcon>
                        <CheckIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Mark as Completed</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleUpdateStatus(selectedAppointment?.id, 'Cancelled')}>
                    <ListItemIcon>
                        <CancelIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cancel Appointment</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleDeleteAppointment(selectedAppointment?.id)}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete Appointment</ListItemText>
                </MenuItem>
            </Menu>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === 'add' ? 'Schedule New Appointment' : 'Edit Appointment'}
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Appointment scheduling form will be implemented here with proper validation and API integration.
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        This dialog will include fields for:
                    </Typography>
                    <ul>
                        <li>Patient selection and search</li>
                        <li>Date and time picker</li>
                        <li>Appointment type selection</li>
                        <li>Duration and notes</li>
                        <li>Reminder settings</li>
                        <li>Conflict checking</li>
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleCloseDialog}>
                        {dialogType === 'add' ? 'Schedule' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AppointmentsPage;
