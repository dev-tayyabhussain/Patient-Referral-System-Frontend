import React from 'react';
import {
    Box,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    Radio,
    FormControlLabel,
    Typography,
    Autocomplete,
    CircularProgress,
} from '@mui/material';
import { Hospital } from '../../types/hospital';

interface DoctorFormProps {
    formData: any;
    setFormData: (data: any) => void;
    hospitals: Hospital[];
    loadingHospitals?: boolean;
    userRole?: string;
    userHospitalId?: string;
}

const DoctorForm: React.FC<DoctorFormProps> = ({
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
                    label="Password"
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    helperText="Minimum 6 characters"
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
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Practice Type
                </Typography>
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        value={formData.practiceType || 'hospital'}
                        onChange={(e) => setFormData({ ...formData, practiceType: e.target.value })}
                    >
                        <FormControlLabel value="hospital" control={<Radio />} label="In Hospital" />
                        <FormControlLabel value="own_clinic" control={<Radio />} label="Own Clinic" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            {formData.practiceType === 'hospital' && (
                <Grid item xs={12}>
                    <Autocomplete
                        options={hospitals}
                        getOptionLabel={(option) => `${option.name} - ${option.address.city}, ${option.address.state}`}
                        loading={loadingHospitals}
                        value={hospitals.find(h => h._id === formData.hospitalId) || null}
                        onChange={(_, value) => setFormData({ ...formData, hospitalId: value?._id || '' })}
                        disabled={userRole === 'hospital' && userHospitalId}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Hospital"
                                required
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
            {formData.practiceType === 'own_clinic' && (
                <>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Clinic Information
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Clinic Name"
                            value={formData.clinicName || ''}
                            onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Clinic Phone"
                            value={formData.clinicPhone || ''}
                            onChange={(e) => setFormData({ ...formData, clinicPhone: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Clinic Email"
                            type="email"
                            value={formData.clinicEmail || ''}
                            onChange={(e) => setFormData({ ...formData, clinicEmail: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Clinic Website"
                            value={formData.clinicWebsite || ''}
                            onChange={(e) => setFormData({ ...formData, clinicWebsite: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Street Address"
                            value={formData.clinicAddress?.street || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                clinicAddress: { ...formData.clinicAddress, street: e.target.value }
                            })}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="City"
                            value={formData.clinicAddress?.city || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                clinicAddress: { ...formData.clinicAddress, city: e.target.value }
                            })}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="State"
                            value={formData.clinicAddress?.state || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                clinicAddress: { ...formData.clinicAddress, state: e.target.value }
                            })}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="ZIP Code"
                            value={formData.clinicAddress?.zipCode || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                clinicAddress: { ...formData.clinicAddress, zipCode: e.target.value }
                            })}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Clinic Description"
                            multiline
                            rows={3}
                            value={formData.clinicDescription || ''}
                            onChange={(e) => setFormData({ ...formData, clinicDescription: e.target.value })}
                        />
                    </Grid>
                </>
            )}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Professional Information
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="License Number"
                    value={formData.licenseNumber || ''}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Specialization"
                    value={formData.specialization || ''}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    value={formData.yearsOfExperience || 0}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Qualification"
                    value={formData.qualification || ''}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
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

export default DoctorForm;

