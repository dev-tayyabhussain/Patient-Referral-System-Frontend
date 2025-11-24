import React from 'react';
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Autocomplete,
    CircularProgress,
} from '@mui/material';
import { Hospital } from '../../types/hospital';

interface PatientFormProps {
    formData: any;
    setFormData: (data: any) => void;
    hospitals: Hospital[];
    loadingHospitals?: boolean;
    userRole?: string;
    userHospitalId?: string;
}

const PatientForm: React.FC<PatientFormProps> = ({
    formData,
    setFormData,
    hospitals,
    loadingHospitals = false,
    userRole,
    userHospitalId,
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Personal Information
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Password (Optional)"
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    helperText="Leave empty to generate random password"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                        value={formData.gender || ''}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        label="Gender"
                    >
                        <MenuItem value="">Select Gender</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Emergency Contact Name"
                    value={formData.emergencyContact?.name || ''}
                    onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Emergency Phone"
                    value={formData.emergencyPhone || formData.emergencyContact?.phone || ''}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            emergencyPhone: e.target.value,
                            emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                        });
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Emergency Contact Relationship"
                    value={formData.emergencyContact?.relationship || ''}
                    onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Emergency Contact Email"
                    type="email"
                    value={formData.emergencyContact?.email || ''}
                    onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, email: e.target.value }
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Blood Type</InputLabel>
                    <Select
                        value={formData.bloodType || ''}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        label="Blood Type"
                    >
                        <MenuItem value="A+">A+</MenuItem>
                        <MenuItem value="A-">A-</MenuItem>
                        <MenuItem value="B+">B+</MenuItem>
                        <MenuItem value="B-">B-</MenuItem>
                        <MenuItem value="AB+">AB+</MenuItem>
                        <MenuItem value="AB-">AB-</MenuItem>
                        <MenuItem value="O+">O+</MenuItem>
                        <MenuItem value="O-">O-</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            {userRole === 'super_admin' && (
                <Grid item xs={12}>
                    <Autocomplete
                        options={hospitals}
                        getOptionLabel={(option) => `${option.name} - ${option.address.city}, ${option.address.state}`}
                        loading={loadingHospitals}
                        value={hospitals.find(h => h._id === formData.hospitalId) || null}
                        onChange={(_, value) => setFormData({ ...formData, hospitalId: value?._id || '' })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Hospital"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingHospitals ? <CircularProgress size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Address
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Street Address"
                    value={formData.address?.street || ''}
                    onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value }
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label="City"
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value }
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label="State"
                    value={formData.address?.state || ''}
                    onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value }
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label="ZIP Code"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, zipCode: e.target.value }
                    })}
                />
            </Grid>
        </Grid>
    );
};

export default PatientForm;

