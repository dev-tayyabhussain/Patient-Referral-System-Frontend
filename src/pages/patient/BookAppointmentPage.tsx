import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Chip,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon,
    Person as PersonIcon,
    LocalHospital as HospitalIcon,
    MedicalServices as MedicalIcon,
    CheckCircle as CheckIcon,
    Schedule as ScheduleIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';

const BookAppointmentPage: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [appointmentType, setAppointmentType] = useState('');
    const [reason, setReason] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    // Mock data
    const doctors = [
        {
            id: '1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            hospital: 'City General Hospital',
            rating: 4.8,
            experience: 8,
            nextAvailable: '2024-01-20',
            avatar: 'SJ',
        },
        {
            id: '2',
            name: 'Dr. Michael Chen',
            specialty: 'Neurology',
            hospital: 'City General Hospital',
            rating: 4.9,
            experience: 12,
            nextAvailable: '2024-01-22',
            avatar: 'MC',
        },
        {
            id: '3',
            name: 'Dr. Emily Rodriguez',
            specialty: 'Pediatrics',
            hospital: 'City General Hospital',
            rating: 4.7,
            experience: 6,
            nextAvailable: '2024-01-18',
            avatar: 'ER',
        },
    ];

    const availableTimes = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
        '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM'
    ];

    const appointmentTypes = [
        'General Consultation',
        'Follow-up Visit',
        'Emergency Consultation',
        'Routine Checkup',
        'Specialist Consultation',
        'Second Opinion',
    ];

    const steps = [
        'Select Doctor',
        'Choose Date & Time',
        'Appointment Details',
        'Confirmation'
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedTime('');
        setAppointmentType('');
        setReason('');
    };

    const handleBookAppointment = () => {
        setOpenConfirmDialog(true);
    };

    const handleConfirmBooking = () => {
        // Here you would typically make an API call to book the appointment
        console.log('Appointment booked:', {
            doctor: selectedDoctor,
            date: selectedDate,
            time: selectedTime,
            type: appointmentType,
            reason: reason
        });
        setOpenConfirmDialog(false);
        handleReset();
    };

    const isStepValid = (step: number) => {
        switch (step) {
            case 0:
                return selectedDoctor !== null;
            case 1:
                return selectedDate !== '' && selectedTime !== '';
            case 2:
                return appointmentType !== '' && reason !== '';
            default:
                return false;
        }
    };

    const renderDoctorSelection = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Choose Your Doctor
            </Typography>
            <Grid container spacing={2}>
                {doctors.map((doctor) => (
                    <Grid item xs={12} md={6} key={doctor.id}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                border: selectedDoctor?.id === doctor.id ? 2 : 1,
                                borderColor: selectedDoctor?.id === doctor.id ? 'primary.main' : 'divider',
                                '&:hover': {
                                    boxShadow: 3,
                                },
                            }}
                            onClick={() => setSelectedDoctor(doctor)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                        {doctor.avatar}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6">
                                            {doctor.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {doctor.specialty}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${doctor.rating}/5`}
                                        color="primary"
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Experience
                                    </Typography>
                                    <Typography variant="body2">
                                        {doctor.experience} years
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Hospital
                                    </Typography>
                                    <Typography variant="body2">
                                        {doctor.hospital}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Next Available
                                    </Typography>
                                    <Typography variant="body2">
                                        {doctor.nextAvailable}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    const renderDateTimeSelection = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Select Date & Time
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Select Date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Select Time</InputLabel>
                        <Select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            label="Select Time"
                        >
                            {availableTimes.map((time) => (
                                <MenuItem key={time} value={time}>
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {selectedDate && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Selected: {selectedDate} at {selectedTime}
                </Alert>
            )}
        </Box>
    );

    const renderAppointmentDetails = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Appointment Details
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Appointment Type</InputLabel>
                        <Select
                            value={appointmentType}
                            onChange={(e) => setAppointmentType(e.target.value)}
                            label="Appointment Type"
                        >
                            {appointmentTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Reason for Visit"
                        multiline
                        rows={4}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please describe your symptoms or reason for the appointment..."
                    />
                </Grid>
            </Grid>
        </Box>
    );

    const renderConfirmation = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Confirm Your Appointment
            </Typography>
            <Card>
                <CardContent>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Doctor"
                                secondary={selectedDoctor?.name}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CalendarIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Date"
                                secondary={selectedDate}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <TimeIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Time"
                                secondary={selectedTime}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <MedicalIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Type"
                                secondary={appointmentType}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <HospitalIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Hospital"
                                secondary={selectedDoctor?.hospital}
                            />
                        </ListItem>
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                        <strong>Reason:</strong> {reason}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Book an Appointment
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Schedule your appointment with our healthcare professionals
                </Typography>
            </Box>

            {/* Stepper */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Stepper activeStep={activeStep} orientation="horizontal">
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>

            {/* Step Content */}
            <Card>
                <CardContent>
                    {activeStep === 0 && renderDoctorSelection()}
                    {activeStep === 1 && renderDateTimeSelection()}
                    {activeStep === 2 && renderAppointmentDetails()}
                    {activeStep === 3 && renderConfirmation()}

                    {/* Navigation Buttons */}
                    <Box sx={{ display: 'flex', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleBookAppointment}
                                startIcon={<CheckIcon />}
                            >
                                Book Appointment
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={!isStepValid(activeStep)}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Confirm Appointment Booking
                </DialogTitle>
                <DialogContent>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Your appointment has been successfully booked!
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        You will receive a confirmation email with appointment details and any preparation instructions.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={handleConfirmBooking}>
                        View My Appointments
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BookAppointmentPage;
