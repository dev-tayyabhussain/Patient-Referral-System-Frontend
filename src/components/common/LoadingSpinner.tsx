import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface LoadingSpinnerProps {
    message?: string;
    size?: number;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Loading...',
    size = 40,
    fullScreen = false
}) => {
    const theme = useTheme();

    const content = (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
        >
            <CircularProgress
                size={size}
                sx={{
                    color: theme.palette.primary.main
                }}
            />
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                    fontWeight: 500,
                    textAlign: 'center'
                }}
            >
                {message}
            </Typography>
        </Box>
    );

    if (fullScreen) {
        return (
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(255, 255, 255, 0.8)"
                zIndex={9999}
            >
                {content}
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight={200}
            p={4}
        >
            {content}
        </Box>
    );
};

export default LoadingSpinner;
