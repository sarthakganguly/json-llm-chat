import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Paper, Box, Typography, TextField, IconButton, Avatar, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface Message { sender: 'user' | 'bot'; text: string; }

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await api.post('/query/chat', { query: input });
      const botMessage: Message = { sender: 'bot', text: response.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = { sender: 'bot', text: 'Sorry, I encountered an error while fetching a response.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
      <Box p={2} borderBottom={1} borderColor="divider">
        <Typography variant="h6" component="h2">Chat with your Data</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        {messages.length === 0 && !isLoading && (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%" color="text.secondary">
            <Typography>Upload a document and ask a question to start.</Typography>
          </Box>
        )}
        {messages.map((msg, index) => (
          <Box key={index} display="flex" justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'} mb={2}>
            {msg.sender === 'bot' && <Avatar sx={{ bgcolor: 'secondary.main', mr: 1.5 }}><SmartToyIcon /></Avatar>}
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                maxWidth: '70%',
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.default',
                color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                whiteSpace: 'pre-wrap'
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
            {msg.sender === 'user' && <Avatar sx={{ bgcolor: 'primary.main', ml: 1.5 }}><PersonIcon /></Avatar>}
          </Box>
        ))}
        {isLoading && (
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 1.5 }}><SmartToyIcon /></Avatar>
            <Paper elevation={1} sx={{ p: 1.5, bgcolor: 'background.default' }}>
              <CircularProgress size={20} />
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box p={2} borderTop={1} borderColor="divider" component="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth variant="outlined" placeholder="Ask a question..."
            value={input} onChange={(e) => setInput(e.target.value)}
            disabled={isLoading} autoComplete="off"
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          />
          <IconButton color="primary" type="submit" disabled={isLoading} sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}