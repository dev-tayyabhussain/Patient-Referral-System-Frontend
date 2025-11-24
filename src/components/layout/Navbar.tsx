import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Avatar,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    AccountCircle,
    Login as LoginIcon,
    PersonAdd as RegisterIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleProfileMenuClose();
        navigate('/');
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setMobileOpen(false);
    };

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Features', path: '/features' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ];

    const drawer = (
        <Box sx={{ width: 280 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                    MediNet
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            selected={location.pathname === item.path}
                        >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider sx={{ my: 2 }} />
                {isAuthenticated ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigation('/dashboard')}>
                                <DashboardIcon sx={{ mr: 2 }} />
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 2 }} />
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigation('/login')}>
                                <LoginIcon sx={{ mr: 2 }} />
                                <ListItemText primary="Sign In" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleNavigation('/register')}>
                                <RegisterIcon sx={{ mr: 2 }} />
                                <ListItemText primary="Get Started" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
                    color: 'text.primary',
                }}
            >
                <Toolbar>
                    {/* Mobile Menu Button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: { xs: 1, md: 0 },
                            mr: { md: 6 },
                            fontWeight: 700,
                            color: 'primary.main',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/')}
                    >
                        MediNet
                    </Typography>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, ml: 4 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                color="inherit"
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    mx: 1,
                                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                                    fontWeight: location.pathname === item.path ? 600 : 400,
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    {/* Desktop Auth Buttons */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        {isAuthenticated ? (
                            <>
                                <Button
                                    variant="outlined"
                                    startIcon={<DashboardIcon />}
                                    onClick={() => navigate('/dashboard')}
                                    sx={{
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        '&:hover': {
                                            borderColor: 'primary.dark',
                                            bgcolor: 'primary.light',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls="primary-search-account-menu"
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </Avatar>
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate('/login')}
                                    sx={{ fontWeight: 500 }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        px: 3,
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                    }}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
            >
                <MenuItem onClick={() => { handleNavigation('/dashboard'); handleProfileMenuClose(); }}>
                    <DashboardIcon sx={{ mr: 2 }} />
                    Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 2 }} />
                    Logout
                </MenuItem>
            </Menu>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;
