import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import FileUpload from '../components/FileUpload';

export default function DashboardPage() {
    const [lastUploadTime, setLastUploadTime] = useState(Date.now());

    const handleUploadSuccess = () => {
        setLastUploadTime(Date.now());
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Left Column for Upload */}
                <div className="xl:col-span-1">
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                </div>
                {/* Right Column for Chat */}
                <div className="xl:col-span-2">
                    <ChatInterface key={lastUploadTime} />
                </div>
            </div>
        </div>
    );
}
