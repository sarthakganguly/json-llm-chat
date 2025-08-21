import { useState } from 'react';
import api from '../services/api';
import { UploadCloud } from 'lucide-react';

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
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setMessage(`Uploading ${file.name}...`);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/data/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
      onUploadSuccess();
    } catch (err) {
      console.error(err);
      setError('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Upload Data</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center py-10 hover:border-blue-500 transition-colors">
            <UploadCloud className="w-10 h-10 text-slate-400 mb-2"/>
            <span className="font-medium text-blue-600">Click to upload</span>
            <span className="text-slate-500 text-sm">or drag and drop</span>
            <span className="text-xs text-slate-400 mt-2">JSON files only</span>
          </label>
          <input id="file-upload" type="file" accept=".json" onChange={handleFileChange} className="sr-only" />
        </div>

        {file && !isUploading && (
          <p className="text-sm text-center text-slate-600 font-medium">
            Selected: {file.name}
          </p>
        )}
        
        {message && <p className="text-sm text-center text-green-600">{message}</p>}
        {error && <p className="text-sm text-center text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={!file || isUploading}
          className="w-full inline-flex justify-center items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
    </div>
  );
}
