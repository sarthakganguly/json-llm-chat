import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import FileUpload from '../components/FileUpload';

// Import Box instead of Grid
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function DashboardPage() {
    const [lastUploadTime, setLastUploadTime] = useState(Date.now());

    const handleUploadSuccess = () => {
        setLastUploadTime(Date.now());
    };

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Dashboard
            </Typography>

            {/* 
              THIS IS THE NEW LAYOUT:
              We use a flexbox container. On medium (md) screens and up, it's a row.
              On extra-small (xs) screens, it wraps to a column.
            */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4, // This creates the spacing between the items
                alignItems: 'flex-start'
              }}
            >
                {/* Left Column */}
                <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                </Box>
                
                {/* Right Column */}
                <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
                    <ChatInterface key={lastUploadTime} />
                </Box>
            </Box>
        </>
    );
}