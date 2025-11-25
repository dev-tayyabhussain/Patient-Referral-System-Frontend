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

interface ReferralFormProps {
    formData: any;
    setFormData: (data: any) => void;
    hospitals: Hospital[];
    patients: any[];
    receivingDoctors: any[];
    referringDoctors: any[];
    loadingHospitals?: boolean;
    loadingPatients?: boolean;
    loadingReceivingDoctors?: boolean;
    loadingReferringDoctors?: boolean;
}

const ReferralForm: React.FC<ReferralFormProps> = ({
    formData,
    setFormData,
    hospitals,
    patients,
    receivingDoctors,
    referringDoctors,
    loadingHospitals = false,
    loadingPatients = false,
    loadingReceivingDoctors = false,
    loadingReferringDoctors = false,
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Patient & Hospital Information
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    options={patients}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
                    loading={loadingPatients}
                    value={patients.find(p => p._id === formData.patientId) || null}
                    onChange={(_, value) => setFormData({ ...formData, patientId: value?._id || '' })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Patient"
                            required
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loadingPatients ? <CircularProgress size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    options={hospitals}
                    getOptionLabel={(option) => `${option.name} - ${option.address.city}, ${option.address.state}`}
                    loading={loadingHospitals}
                    value={hospitals.find(h => h._id === formData.receivingHospitalId) || null}
                    onChange={(_, value) => setFormData({ ...formData, receivingHospitalId: value?._id || '', receivingDoctorId: '' })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Receiving Hospital"
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
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    options={receivingDoctors}
                    getOptionLabel={(option) => `Dr. ${option.firstName} ${option.lastName} - ${option.specialization || 'N/A'}`}
                    loading={loadingReceivingDoctors}
                    value={receivingDoctors.find(d => d._id === formData.receivingDoctorId) || null}
                    onChange={(_, value) => setFormData({ ...formData, receivingDoctorId: value?._id || '' })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Receiving Doctor (Optional)"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loadingReceivingDoctors ? <CircularProgress size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    options={referringDoctors}
                    getOptionLabel={(option) => `Dr. ${option.firstName} ${option.lastName} - ${option.specialization || 'N/A'}`}
                    loading={loadingReferringDoctors}
                    value={referringDoctors.find(d => d._id === formData.referringDoctorId) || null}
                    onChange={(_, value) => setFormData({ ...formData, referringDoctorId: value?._id || '' })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Referring Doctor (Optional - Auto-assigned if not specified)"
                            helperText="Leave empty to auto-assign from your hospital"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loadingReferringDoctors ? <CircularProgress size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={formData.priority || 'medium'}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        label="Priority"
                    >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Specialty"
                    value={formData.specialty || ''}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Clinical Information
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Reason for Referral"
                    multiline
                    rows={3}
                    value={formData.reason || ''}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                    helperText="Required"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Chief Complaint"
                    multiline
                    rows={2}
                    value={formData.chiefComplaint || ''}
                    onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="History of Present Illness"
                    multiline
                    rows={3}
                    value={formData.historyOfPresentIllness || ''}
                    onChange={(e) => setFormData({ ...formData, historyOfPresentIllness: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Physical Examination"
                    multiline
                    rows={3}
                    value={formData.physicalExamination || ''}
                    onChange={(e) => setFormData({ ...formData, physicalExamination: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Additional Information
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Diagnosis"
                    value={formData.diagnosis || ''}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Treatment Plan"
                    value={formData.treatmentPlan || ''}
                    onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
            </Grid>
        </Grid>
    );
};

export default ReferralForm;

