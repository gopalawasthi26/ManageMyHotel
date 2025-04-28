import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  Pool as PoolIcon,
  Spa as SpaIcon,
  FitnessCenter as FitnessCenterIcon,
  Wifi as WifiIcon,
  LocalParking as ParkingIcon,
  RoomService as RoomServiceIcon,
  Event as EventIcon,
  LocalOffer as OfferIcon,
  Support as SupportIcon,
  DirectionsCar as TransportIcon,
} from '@mui/icons-material';

const quickQuestions = [
  { text: 'Room Types', icon: <HotelIcon /> },
  { text: 'Dining', icon: <RestaurantIcon /> },
  { text: 'Amenities', icon: <PoolIcon /> },
  { text: 'Events', icon: <EventIcon /> },
  { text: 'Deals', icon: <OfferIcon /> },
  { text: 'Transport', icon: <TransportIcon /> },
];

const roomSuggestions = [
  {
    type: 'Standard Room',
    description: 'Perfect for solo travelers or couples',
    price: '$100/night',
    features: ['Queen bed', 'City view', 'Free WiFi', 'Smart TV'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  },
  {
    type: 'Deluxe Room',
    description: 'Ideal for small families or business travelers',
    price: '$150/night',
    features: ['King bed', 'Balcony', 'Mini bar', 'Work desk'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  },
  {
    type: 'Suite',
    description: 'Luxury experience with extra space',
    price: '$250/night',
    features: ['Separate living area', 'Ocean view', 'Jacuzzi', 'Butler service'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  },
];

const specialOffers = [
  {
    title: 'Weekend Getaway',
    description: 'Stay 2 nights, get 1 night free',
    code: 'WEEKEND20',
    validUntil: 'December 31, 2023',
  },
  {
    title: 'Early Bird Special',
    description: 'Book 30 days in advance, save 15%',
    code: 'EARLY15',
    validUntil: 'Ongoing',
  },
  {
    title: 'Family Package',
    description: 'Kids stay and eat free',
    code: 'FAMILYFREE',
    validUntil: 'December 31, 2023',
  },
];

const transportOptions = [
  {
    type: 'Airport Transfer',
    description: 'Complimentary for suite guests',
    price: '$30 for other guests',
    details: '24/7 service available',
  },
  {
    type: 'City Tour',
    description: 'Guided city tours',
    price: '$50 per person',
    details: 'Daily at 10 AM and 2 PM',
  },
  {
    type: 'Car Rental',
    description: 'Partnered with premium car rental services',
    price: 'Starting from $60/day',
    details: 'Special rates for hotel guests',
  },
];

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your hotel assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth'  });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    const userMessage = {
      text: question,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(question);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('room') || lowerInput.includes('book')) {
      return {
        text: "We offer several room types to suit your needs. Here are our recommendations:",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: roomSuggestions,
      };
    } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('deal')) {
      return {
        text: "We have several special offers available:",
        sender: 'bot',
        timestamp: new Date(),
        offers: specialOffers,
      };
    } else if (lowerInput.includes('amenities') || lowerInput.includes('facilities')) {
      return {
        text: "Our hotel offers a wide range of amenities to make your stay comfortable:",
        sender: 'bot',
        timestamp: new Date(),
        amenities: [
          { icon: <PoolIcon />, text: 'Swimming Pool' },
          { icon: <SpaIcon />, text: 'Spa & Wellness Center' },
          { icon: <FitnessCenterIcon />, text: 'Fitness Center' },
          { icon: <RestaurantIcon />, text: 'Multiple Restaurants' },
          { icon: <WifiIcon />, text: 'Free High-Speed WiFi' },
          { icon: <ParkingIcon />, text: 'Complimentary Parking' },
          { icon: <RoomServiceIcon />, text: '24/7 Room Service' },
        ],
      };
    } else if (lowerInput.includes('check-in') || lowerInput.includes('check out')) {
      return {
        text: "Standard check-in time is 2:00 PM and check-out time is 12:00 PM. We offer early check-in and late check-out options based on availability. Would you like to know more about our flexible check-in/check-out policies?",
        sender: 'bot',
        timestamp: new Date(),
      };
    } else if (lowerInput.includes('cancel') || lowerInput.includes('refund')) {
      return {
        text: "Our cancellation policy allows free cancellation up to 24 hours before check-in. For non-refundable rates, we offer the option to modify your booking instead of canceling. Would you like more details about our cancellation policy?",
        sender: 'bot',
        timestamp: new Date(),
      };
    } else if (lowerInput.includes('restaurant') || lowerInput.includes('dining')) {
      return {
        text: "We have several dining options available:",
        sender: 'bot',
        timestamp: new Date(),
        dining: [
          { name: 'The Main Restaurant', type: 'International Cuisine', hours: '7:00 AM - 11:00 PM' },
          { name: 'Poolside Bar & Grill', type: 'Casual Dining', hours: '11:00 AM - 10:00 PM' },
          { name: 'The Rooftop Lounge', type: 'Cocktails & Light Bites', hours: '5:00 PM - 1:00 AM' },
          { name: 'In-Room Dining', type: '24/7 Service', hours: 'Available 24 hours' },
        ],
      };
    } else if (lowerInput.includes('event') || lowerInput.includes('meeting')) {
      return {
        text: "We offer various event spaces and services:",
        sender: 'bot',
        timestamp: new Date(),
        events: [
          { name: 'Grand Ballroom', capacity: '500 guests', features: ['Stage', 'Dance floor', 'A/V equipment'] },
          { name: 'Conference Center', capacity: '200 guests', features: ['Projector', 'WiFi', 'Catering'] },
          { name: 'Board Room', capacity: '20 guests', features: ['Video conferencing', 'Whiteboard', 'Refreshments'] },
        ],
      };
    } else if (lowerInput.includes('transport') || lowerInput.includes('airport')) {
      return {
        text: "We offer several transportation options:",
        sender: 'bot',
        timestamp: new Date(),
        transport: transportOptions,
      };
    } else {
      return {
        text: "I'm here to help with information about our rooms, amenities, dining options, events, and transportation services. Feel free to ask about anything specific!",
        sender: 'bot',
        timestamp: new Date(),
      };
    }
  };

  const renderMessageContent = (message) => {
    if (message.suggestions) {
      return (
        <Box>
          <Typography>{message.text}</Typography>
          {message.suggestions.map((room, index) => (
            <Paper 
              key={index} 
              sx={{ 
                p: 2, 
                mt: 1, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ 
                  width: 120,
                  height: 120,
                  borderRadius: 1,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <img 
                    src={room.image} 
                    alt={room.type}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6">{room.type}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>{room.description}</Typography>
                  <Typography color="primary" sx={{ mb: 1 }}>{room.price}</Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    {room.features.map((feature, i) => (
                      <Chip 
                        key={i} 
                        label={feature} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      );
    }

    if (message.offers) {
      return (
        <Box>
          <Typography>{message.text}</Typography>
          {message.offers.map((offer, index) => (
            <Paper 
              key={index} 
              sx={{ 
                p: 2, 
                mt: 1, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" color="primary">{offer.title}</Typography>
              <Typography sx={{ mb: 1 }}>{offer.description}</Typography>
              <Typography variant="body2" color="text.secondary">
                Code: <strong>{offer.code}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valid until: {offer.validUntil}
              </Typography>
            </Paper>
          ))}
        </Box>
      );
    }

    if (message.amenities) {
      return (
        <Box>
          <Typography>{message.text}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
            {message.amenities.map((amenity, index) => (
              <Chip
                key={index}
                icon={amenity.icon}
                label={amenity.text}
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Stack>
        </Box>
      );
    }

    if (message.dining) {
      return (
        <Box>
          <Typography>{message.text}</Typography>
          {message.dining.map((restaurant, index) => (
            <Paper 
              key={index} 
              sx={{ 
                p: 2, 
                mt: 1, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6">{restaurant.name}</Typography>
              <Typography color="text.secondary">{restaurant.type}</Typography>
              <Typography color="primary" sx={{ mt: 1 }}>{restaurant.hours}</Typography>
            </Paper>
          ))}
        </Box>
      );
    }

    if (message.events) {
      return (
        <Box>
          <Typography>{message.text}</Typography>
          {message.events.map((event, index) => (
            <Paper 
              key={index} 
              sx={{ 
                p: 2, 
                mt: 1, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6">{event.name}</Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Capacity: {event.capacity}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                {event.features.map((feature, i) => (
                  <Chip 
                    key={i} 
                    label={feature} 
                    size="small" 
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Stack>
            </Paper>
          ))}
        </Box>
      );
    }

    if (message.transport) {
      return (
        <Box>
          <Typography>{message.text}</Typography>
          {message.transport.map((option, index) => (
            <Paper 
              key={index} 
              sx={{ 
                p: 2, 
                mt: 1, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6">{option.type}</Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {option.description}
              </Typography>
              <Typography color="primary" sx={{ mb: 1 }}>
                {option.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.details}
              </Typography>
            </Paper>
          ))}
        </Box>
      );
    }

    return message.text;
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      {!isOpen && (
        <Fade in={true}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ChatIcon />}
            onClick={() => setIsOpen(true)}
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
              transition: 'all 0.3s ease',
            }}
          >
            Chat with us
          </Button>
        </Fade>
      )}

      {isOpen && (
        <Fade in={true}>
          <Paper
            elevation={0}
            className="chatbot-paper"
            sx={{
              width: 400,
              height: 600,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6">Hotel Assistant</Typography>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2,
                bgcolor: 'background.default',
              }}
            >
              <List>
                {messages.map((message, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        py: 1.5,
                        px: 0,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                            width: 36,
                            height: 36,
                          }}
                        >
                          {message.sender === 'user' ? 'U' : 'B'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={renderMessageContent(message)}
                        secondary={new Date(message.timestamp).toLocaleTimeString()}
                        sx={{
                          ml: message.sender === 'user' ? 0 : 2,
                          mr: message.sender === 'user' ? 2 : 0,
                          textAlign: message.sender === 'user' ? 'right' : 'left',
                          '& .MuiListItemText-primary': {
                            maxWidth: '100%',
                            wordBreak: 'break-word',
                          },
                        }}
                      />
                    </ListItem>
                    {index < messages.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
                {isTyping && (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>B</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <CircularProgress size={20} />
                          <Typography>Typing...</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                )}
                <div ref={messagesEndRef} />
              </List>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {quickQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    icon={question.icon}
                    label={question.text}
                    onClick={() => handleQuickQuestion(question.text)}
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Stack>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  sx={{ borderRadius: 1 }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default ChatBot; 