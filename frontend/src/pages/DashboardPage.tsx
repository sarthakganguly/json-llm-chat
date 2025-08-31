import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import FileUpload from '../components/FileUpload';
// Make sure Grid is correctly imported from '@mui/material'
import { Grid, Typography } from '@mui/material';

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
              THIS IS THE FIX:
              Ensure you have a <Grid container> wrapping the <Grid item> components.
              The 'item' prop is a boolean passed to the Grid component.
            */}
            <Grid container spacing={4} alignItems="flex-start">
                <Grid item xs={12} md={4}>
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                </Grid>
                <Grid item xs={12} md={8}>
                    <ChatInterface key={lastUploadTime} />
                </Grid>
            </Grid>
        </>
    );
}