import React from 'react';
import {
    Box,
    TextField,
    Grid,
    InputAdornment,
    IconButton,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { Controller, Control, FieldErrors } from 'react-hook-form';

interface PasswordStepProps {
    control: Control<any>;
    errors: FieldErrors<any>;
    showPassword: boolean;
    showConfirmPassword: boolean;
    onTogglePassword: () => void;
    onToggleConfirmPassword: () => void;
}

const PasswordStep: React.FC<PasswordStepProps> = ({
    control,
    errors,
    showPassword,
    showConfirmPassword,
    onTogglePassword,
    onToggleConfirmPassword,
}) => {
    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                error={!!errors.password}
                                helperText={errors.password?.message || 'Password must be at least 8 characters long'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={onTogglePassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={onToggleConfirmPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default PasswordStep;
