import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    Stack,
    Chip,
    Avatar,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    LocalHospital as HospitalIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Analytics as AnalyticsIcon,
    Security as SecurityIcon,
    Speed as SpeedIcon,
    CloudUpload as CloudIcon,
    Notifications as NotificationIcon,
    MobileFriendly as MobileIcon,
    IntegrationInstructions as IntegrationIcon,
    CheckCircle as CheckIcon,
    Star as StarIcon,
    TrendingUp as TrendingIcon,
    Shield as ShieldIcon,
    Support as SupportIcon,
    Schedule as ScheduleIcon,
    Assessment as ReportIcon,
} from '@mui/icons-material';

const FeaturesPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const mainFeatures = [
        {
            icon: <HospitalIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
            title: 'Hospital Management',
            description: 'Comprehensive hospital administration and management system with real-time monitoring and analytics.',
            features: [
                'Hospital registration and approval workflow',
                'Multi-location hospital management',
                'Real-time bed availability tracking',
                'Staff management and role assignment',
                'Resource allocation and scheduling',
                'Performance metrics and reporting',
            ],
            color: 'primary',
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
            title: 'Patient Records',
            description: 'Secure and centralized patient health record management with HIPAA compliance and data encryption.',
            features: [
                'Comprehensive patient profiles',
                'Medical history and records',
                'Lab results and imaging',
                'Medication management',
                'Allergy and condition tracking',
                'Secure data sharing between providers',
            ],
            color: 'secondary',
        },
        {
            icon: <AssignmentIcon sx={{ fontSize: 60, color: 'info.main' }} />,
            title: 'Referral System',
            description: 'Efficient doctor-to-doctor patient referral system with automated workflows and notifications.',
            features: [
                'Digital referral creation and management',
                'Automated PDF generation',
                'Email and SMS notifications',
                'Referral tracking and status updates',
                'Priority-based routing',
                'Follow-up and feedback system',
            ],
            color: 'info',
        },
        {
            icon: <AnalyticsIcon sx={{ fontSize: 60, color: 'success.main' }} />,
            title: 'Analytics & Reports',
            description: 'Comprehensive analytics and reporting capabilities with real-time insights and data visualization.',
            features: [
                'Real-time dashboards',
                'Custom report generation',
                'Performance metrics tracking',
                'Trend analysis and forecasting',
                'Export capabilities (PDF, Excel)',
                'Automated scheduled reports',
            ],
            color: 'success',
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 60, color: 'warning.main' }} />,
            title: 'Security & Compliance',
            description: 'Enterprise-grade security with HIPAA compliance, data encryption, and audit trails.',
            features: [
                'HIPAA compliant data handling',
                'End-to-end encryption',
                'Role-based access control',
                'Audit logs and monitoring',
                'Data backup and recovery',
                'Regular security assessments',
            ],
            color: 'warning',
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 60, color: 'error.main' }} />,
            title: 'Performance & Reliability',
            description: 'High-performance system with 99.9% uptime and lightning-fast response times.',
            features: [
                '99.9% uptime guarantee',
                'Sub-second response times',
                'Scalable cloud infrastructure',
                'Load balancing and failover',
                'Real-time monitoring',
                '24/7 technical support',
            ],
            color: 'error',
        },
    ];

    const additionalFeatures = [
        {
            icon: <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Cloud Integration',
            description: 'Seamless integration with cloud services for file storage and data management.',
        },
        {
            icon: <NotificationIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
            title: 'Smart Notifications',
            description: 'Intelligent notification system with customizable alerts and reminders.',
        },
        {
            icon: <MobileIcon sx={{ fontSize: 40, color: 'success.main' }} />,
            title: 'Mobile Responsive',
            description: 'Fully responsive design that works perfectly on all devices and screen sizes.',
        },
        {
            icon: <IntegrationIcon sx={{ fontSize: 40, color: 'info.main' }} />,
            title: 'API Integration',
            description: 'RESTful APIs for seamless integration with existing healthcare systems.',
        },
        {
            icon: <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
            title: 'Appointment Scheduling',
            description: 'Advanced scheduling system with calendar integration and conflict resolution.',
        },
        {
            icon: <ReportIcon sx={{ fontSize: 40, color: 'error.main' }} />,
            title: 'Custom Reports',
            description: 'Flexible reporting system with drag-and-drop report builder.',
        },
    ];

    const benefits = [
        'Reduce referral processing time by 70%',
        'Improve patient care coordination',
        'Enhance data security and compliance',
        'Streamline hospital operations',
        'Increase staff productivity',
        'Reduce administrative costs',
        'Improve patient satisfaction',
        'Enable data-driven decisions',
    ];

    const stats = [
        { label: 'Hospitals Connected', value: '500+', icon: <HospitalIcon /> },
        { label: 'Active Users', value: '10K+', icon: <PeopleIcon /> },
        { label: 'Referrals Processed', value: '50K+', icon: <AssignmentIcon /> },
        { label: 'System Uptime', value: '99.9%', icon: <TrendingIcon /> },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h1"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            fontWeight: 800,
                            mb: 3,
                        }}
                    >
                        Powerful Features
                    </Typography>
                    <Typography
                        variant="h5"
                        component="p"
                        sx={{
                            fontSize: { xs: '1.1rem', md: '1.3rem' },
                            mb: 4,
                            opacity: 0.9,
                            maxWidth: '600px',
                            mx: 'auto',
                        }}
                    >
                        Everything you need to manage healthcare referrals and patient records efficiently
                    </Typography>
                </Container>
            </Box>

            {/* Main Features Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Core Features
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                        Comprehensive healthcare management tools designed for modern medical facilities
                    </Typography>
                </Box>

                <Grid container spacing={6}>
                    {mainFeatures.map((feature, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    p: 4,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: theme.shadows[12],
                                    },
                                }}
                            >
                                <Box sx={{ textAlign: 'center', mb: 4 }}>
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            mx: 'auto',
                                            mb: 3,
                                            bgcolor: `${feature.color}.light`,
                                            color: `${feature.color}.contrastText`,
                                        }}
                                    >
                                        {feature.icon}
                                    </Avatar>
                                    <Typography variant="h4" component="h3" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                                        {feature.description}
                                    </Typography>
                                </Box>

                                <List>
                                    {feature.features.map((item, itemIndex) => (
                                        <ListItem key={itemIndex} sx={{ px: 0 }}>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: 'success.main' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Additional Features Section */}
            <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                            Additional Features
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            More tools and capabilities to enhance your healthcare management
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {additionalFeatures.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        p: 3,
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: theme.shadows[8],
                                        },
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Benefits Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 4 }}>
                            Why Choose MediNet?
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                            Join thousands of healthcare professionals who trust MediNet to streamline their operations and improve patient care.
                        </Typography>

                        <List>
                            {benefits.map((benefit, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                    <ListItemIcon>
                                        <CheckIcon sx={{ color: 'success.main', fontSize: 28 }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                                {benefit}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                color: 'white',
                            }}
                        >
                            <ShieldIcon sx={{ fontSize: 80, mb: 3 }} />
                            <Typography variant="h4" gutterBottom>
                                Enterprise Security
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                                HIPAA Compliant • End-to-End Encryption • 99.9% Uptime
                            </Typography>
                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 3 }} />
                            <Grid container spacing={2}>
                                {stats.map((stat, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    py: 12,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Ready to Experience These Features?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, lineHeight: 1.7 }}>
                        Start your free trial today and discover how MediNet can transform your healthcare operations.
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Chip
                            label="Free 30-day trial"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                px: 2,
                                py: 1,
                                fontSize: '1rem',
                            }}
                        />
                        <Chip
                            label="No credit card required"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                px: 2,
                                py: 1,
                                fontSize: '1rem',
                            }}
                        />
                        <Chip
                            label="24/7 support"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                px: 2,
                                py: 1,
                                fontSize: '1rem',
                            }}
                        />
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default FeaturesPage;
