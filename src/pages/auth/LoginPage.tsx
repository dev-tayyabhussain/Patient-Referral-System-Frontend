import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { CircularProgress, Checkbox, FormControlLabel } from '@mui/material';

const schema = yup.object({
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

type LoginFormData = yup.InferType<typeof schema>;

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            await login(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
            >
                {/* Left Side - Branding & Decoration */}
                <div
                    className="w-full md:w-1/2 relative p-12 text-white flex flex-col justify-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1988C8 0%, #339164 100%)' }}
                >
                    {/* Decorative Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[10%] left-[10%] w-20 h-20 rounded-full bg-white/10 blur-xl"
                        />
                        <motion.div
                            animate={{ y: [0, 30, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[20%] right-[10%] w-32 h-32 rounded-full bg-white/10 blur-xl"
                        />
                        {/* Diagonal Pills */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-80 bg-gradient-to-t from-white/10 to-transparent rounded-full transform rotate-45" />
                        <div className="absolute bottom-20 left-20 w-20 h-60 bg-gradient-to-t from-white/10 to-transparent rounded-full transform rotate-45" />
                        <div className="absolute top-20 right-20 w-20 h-40 bg-gradient-to-b from-white/10 to-transparent rounded-full transform rotate-45" />
                    </div>

                    <div className="relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                        >
                            Welcome to <br /> Patient Referral System
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/90 text-lg leading-relaxed max-w-md"
                        >
                            Streamline your medical practice with our advanced patient referral and management system. Secure, efficient, and reliable.
                        </motion.p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="max-w-md mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-center text-[#1988C8] mb-8 uppercase tracking-wider">User Login</h2>

                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                    <p className="text-red-600 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
                                <div className="space-y-2">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Email className="text-[#1988C8]/50 group-focus-within:text-[#1988C8] transition-colors" />
                                        </div>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            className={`w-full bg-[#1988C8]/5 border-none rounded-full py-4 pl-12 pr-4 text-gray-700 placeholder-[#1988C8]/40 focus:outline-none focus:ring-2 focus:ring-[#1988C8]/50 transition-all duration-200`}
                                            placeholder="Email Address"
                                            autoComplete="email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-xs ml-4">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="text-[#1988C8]/50 group-focus-within:text-[#1988C8] transition-colors" />
                                        </div>
                                        <input
                                            {...register('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            className={`w-full bg-[#1988C8]/5 border-none rounded-full py-4 pl-12 pr-12 text-gray-700 placeholder-[#1988C8]/40 focus:outline-none focus:ring-2 focus:ring-[#1988C8]/50 transition-all duration-200`}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleTogglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#1988C8]/50 hover:text-[#1988C8] transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs ml-4">{errors.password.message}</p>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-white font-bold py-4 rounded-full shadow-lg shadow-[#1988C8]/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-wide text-sm"
                                    style={{ background: 'linear-gradient(135deg, #1988C8 0%, #339164 100%)' }}
                                >
                                    {isLoading ? (
                                        <CircularProgress size={24} sx={{ color: 'white' }} />
                                    ) : (
                                        'Login'
                                    )}
                                </motion.button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-gray-400 text-sm">
                                    Don't have an account?{' '}
                                    <RouterLink
                                        to="/register"
                                        className="text-[#1988C8] font-semibold hover:underline transition-all"
                                    >
                                        Sign Up
                                    </RouterLink>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
