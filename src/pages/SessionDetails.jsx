import React,{useState,useEffect} from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import SessionForm from './SessionForm';
import { Box, Button, CircularProgress, Container, Paper, Typography, IconButton, Chip, Divider, Avatar, Alert } from '@mui/material';
import { ArrowBack, Edit, Delete, AccessTime, Schedule, Room, Person } from '@mui/icons-material'
const SessionDetails = () => {
    const {eventId, sessionId}= useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);


    useEffect(()=>{
    
        if(!sessionId) return;
     
        fetchSession();

    },[sessionId]);

 const fetchSession=async()=>{
        try{
            const response=await sessionAPI.getSessionDetail(sessionId);
            setSession(response.data);

        }catch(error)
        {
            console.error('Error fetching session details:',error);
            setError('Failed to fetch session details.');
        }
        finally
        {setLoading(false);
            setLoading(false);
        }
    }
  

    const handleDelete=async()=>{
        if(window.confirm('Are you sure you want to delete this session?'))
        {
            try{
                await sessionAPI.deleteSession(sessionId);
                navigate(`/events/${eventId}`);
            }catch(error)
            {
                console.error('Failed to delete session:',error);
                setError('Failed to delete session.');
           }
       }
}

   const topics=session?.topics?session.topics.split(',').map(t=>t.trim()):[]
    
    const formatTime = (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!session) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="warning">Session not found</Alert>
            </Container>
        );
    }
 return (
        <Container sx={{ py: 4 }}>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(`/events/${eventId}`)}
                sx={{ mb: 3,backgroundColor:"red" }}
            >
                Back to Event
            </Button>

            <Paper sx={{ p: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
                        {session.title}
                    </Typography>
                    
                    <Box>
                        <IconButton onClick={() => setEditDialogOpen(true)}>
                            <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={handleDelete}>
                            <Delete />
                        </IconButton>
                    </Box>
                </Box>

                {/* Time & Duration */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </Typography>
                    <Chip
                        icon={<Schedule />}
                        label={`${session.duration_minutes} minutes`}
                        sx={{ ml: 2, backgroundColor: "#b388ff",color:"white"  }}
                    />
                </Box>

                {/* Room */}
                {session.room && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Room sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="h6" color="text.secondary">
                            {session.room}
                        </Typography>
                    </Box>
                )}

                {/* Track */}
                {session.track && (
                    <Chip
                        label={session.track}
                        color="primary"
                        sx={{ mb: 3, backgroundColor: "#b388ff", color: "white" }}
                    />
                )}

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                <Typography variant="h6" gutterBottom>
                    Description
                </Typography>
                <Typography variant="body1"  sx={{ whiteSpace: 'pre-wrap' }}>
                    {session.description}
                </Typography>

                {/* Speaker Section */}
                {session.speaker_name && (
                    <>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom>
                            Speaker
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                                <Person />
                            </Avatar>
                            <Box>
                                <Typography variant="h6">
                                    {session.speaker_name}
                                </Typography>
                                {session.speaker_bio && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {session.speaker_bio}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </>
                )}

                {/* Topics */}
                {topics.length > 0 && (
                    <>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom>
                            Topics
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {topics.map((topic, idx) => (
                                <Chip
                                    key={idx}
                                    label={topic}
                                    variant="outlined"
                                    color="secondary"
                                />
                            ))}
                        </Box>
                    </>
                )}

                {/* Capacity */}
                {session.max_attendees && (
                    <>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom>
                            Capacity
                        </Typography>
                        <Typography variant="body1">
                            Maximum {session.max_attendees} attendees
                        </Typography>
                    </>
                )}

                {/* Event Link */}
                <Divider sx={{ my: 3 }} />
                <Button
                    variant="outlined"
                    onClick={() => navigate(`/events/${eventId}`)}
                >
                    View Full Event Schedule
                </Button>
            </Paper>

            {/* Edit Dialog */}
            <SessionForm
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSuccess={() => {
                    fetchSession();
                    setEditDialogOpen(false);
                }}
                eventId={eventId}
                editSession={session}
            />
        </Container>
    );
}

export default SessionDetails;