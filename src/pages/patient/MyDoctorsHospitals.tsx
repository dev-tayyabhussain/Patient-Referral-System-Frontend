import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import {
    LocalHospital as HospitalIcon,
    MedicalServices as DoctorIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Doctor {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    specialization?: string;
    profileImage?: string;
    hospitalId?: {
        _id: string;
        name: string;
        address?: any;
    };
}

interface Hospital {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    type?: string;
    specialties?: string[];
}

const MyDoctorsHospitals: React.FC = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMyDoctorsAndHospitals();
    }, []);

    const fetchMyDoctorsAndHospitals = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');

            // Fetch referrals to get doctors and hospitals
            const referralsResponse = await axios.get(`${API_BASE_URL}api/referrals`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch medical records to get doctors and hospitals
            const recordsResponse = await axios.get(`${API_BASE_URL}api/records`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Extract unique doctors
            const doctorsSet = new Map<string, Doctor>();
            const hospitalsSet = new Map<string, Hospital>();

            // From referrals - handle both array and object response
            if (referralsResponse.data.success) {
                const referrals = Array.isArray(referralsResponse.data.data)
                    ? referralsResponse.data.data
                    : referralsResponse.data.data?.referrals || [];

                referrals.forEach((referral: any) => {
                    if (referral.referringDoctor && referral.referringDoctor._id) {
                        doctorsSet.set(referral.referringDoctor._id, referral.referringDoctor);
                    }
                    if (referral.receivingDoctor && referral.receivingDoctor._id) {
                        doctorsSet.set(referral.receivingDoctor._id, referral.receivingDoctor);
                    }
                    if (referral.referringHospital && referral.referringHospital._id) {
                        hospitalsSet.set(referral.referringHospital._id, referral.referringHospital);
                    }
                    if (referral.receivingHospital && referral.receivingHospital._id) {
                        hospitalsSet.set(referral.receivingHospital._id, referral.receivingHospital);
                    }
                });
            }

            // From medical records - handle both array and object response
            if (recordsResponse.data.success) {
                const records = Array.isArray(recordsResponse.data.data)
                    ? recordsResponse.data.data
                    : recordsResponse.data.data?.records || [];

                records.forEach((record: any) => {
                    if (record.doctor && record.doctor._id) {
                        doctorsSet.set(record.doctor._id, record.doctor);
                    }
                    if (record.hospital && record.hospital._id) {
                        hospitalsSet.set(record.hospital._id, record.hospital);
                    }
                });
            }

            setDoctors(Array.from(doctorsSet.values()));
            setHospitals(Array.from(hospitalsSet.values()));
        } catch (err: any) {
            console.error('Error fetching doctors and hospitals:', err);
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    My Doctors & Hospitals
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Healthcare providers you've interacted with
                </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label={`Doctors (${doctors.length})`} />
                    <Tab label={`Hospitals (${hospitals.length})`} />
                </Tabs>
            </Box>

            {/* Doctors Tab */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    {doctors.length === 0 ? (
                        <Grid item xs={12}>
                            <Alert severity="info">No doctors found. You'll see doctors here after your first referral or medical record.</Alert>
                        </Grid>
                    ) : (
                        doctors.map((doctor) => (
                            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 } }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar
                                                src={doctor.profileImage}
                                                sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}
                                            >
                                                <DoctorIcon />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" component="div">
                                                    Dr. {doctor.firstName} {doctor.lastName}
                                                </Typography>
                                                {doctor.specialization && (
                                                    <Chip
                                                        label={doctor.specialization}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {doctor.email && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <EmailIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {doctor.email}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {doctor.phone && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PhoneIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {doctor.phone}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {doctor.hospitalId && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <HospitalIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {doctor.hospitalId.name}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}

            {/* Hospitals Tab */}
            {tabValue === 1 && (
                <Grid container spacing={3}>
                    {hospitals.length === 0 ? (
                        <Grid item xs={12}>
                            <Alert severity="info">No hospitals found. You'll see hospitals here after your first referral or medical record.</Alert>
                        </Grid>
                    ) : (
                        hospitals.map((hospital) => (
                            <Grid item xs={12} sm={6} md={4} key={hospital._id}>
                                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 } }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar
                                                sx={{ width: 56, height: 56, mr: 2, bgcolor: 'secondary.main' }}
                                            >
                                                <HospitalIcon />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" component="div">
                                                    {hospital.name}
                                                </Typography>
                                                {hospital.type && (
                                                    <Chip
                                                        label={hospital.type}
                                                        size="small"
                                                        color="secondary"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {hospital.email && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <EmailIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {hospital.email}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {hospital.phone && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PhoneIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {hospital.phone}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {hospital.address && (
                                                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                                    <LocationIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {hospital.address.street}, {hospital.address.city}, {hospital.address.state} {hospital.address.zipCode}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {hospital.specialties && hospital.specialties.length > 0 && (
                                                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {hospital.specialties.slice(0, 3).map((specialty, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={specialty}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                    {hospital.specialties.length > 3 && (
                                                        <Chip
                                                            label={`+${hospital.specialties.length - 3} more`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default MyDoctorsHospitals;
