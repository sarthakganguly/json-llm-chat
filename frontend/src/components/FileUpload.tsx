import { useState } from 'react';
import api from '../services/api';
import { Paper, Typography, Button, Box, CircularProgress, Alert, Input } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function FileUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    setError('');
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].type === 'application/json') {
        setFile(e.target.files[0]);
      } else {
        setError('Only .json files are accepted.');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Please select a file first.'); return; }
    setIsUploading(true);
    setMessage(`Uploading ${file.name}...`);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/data/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage(response.data.message);
      onUploadSuccess();
    } catch (err) {
      setError('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Upload Data
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <Box
          component="label"
          htmlFor="file-upload"
          sx={{
            border: '2px dashed',
            borderColor: 'grey.700',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            display: 'block',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          <UploadFileIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
          <Typography>Click to upload or drag and drop</Typography>
          <Typography variant="caption" color="text.secondary">JSON files only</Typography>
          {/* 
            THIS IS THE FIX:
            The 'accept' prop is now inside the 'inputProps' object.
          */}
          <Input 
            id="file-upload" 
            type="file" 
            onChange={handleFileChange} 
            sx={{ display: 'none' }}
            inputProps={{ accept: '.json' }} 
          />
        </Box>
        
        {file && !isUploading && <Typography sx={{ mt: 2, textAlign: 'center' }}>Selected: {file.name}</Typography>}
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.5 }} disabled={!file || isUploading}>
          {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Upload File'}
        </Button>
      </Box>
    </Paper>
  );
}