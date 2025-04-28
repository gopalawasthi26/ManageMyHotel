import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { db } from '../../firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box
} from '@mui/material';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('status', '!=', 'cancelled'));
      const querySnapshot = await getDocs(q);
      
      const bookingsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const bookingData = doc.data();
          
          // Fetch room details
          let roomDetails = null;
          if (bookingData.roomId) {
            const roomDoc = await getDoc(doc(db, 'rooms', bookingData.roomId));
            if (roomDoc.exists()) {
              roomDetails = roomDoc.data();
            }
          }
          
          return {
            id: doc.id,
            ...bookingData,
            roomDetails
          };
        })
      );
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);
      
      if (!bookingDoc.exists()) {
        throw new Error('Booking not found');
      }

      const bookingData = bookingDoc.data();
      
      // Update room status to available
      if (bookingData.roomId) {
        const roomRef = doc(db, 'rooms', bookingData.roomId);
        await updateDoc(roomRef, {
          status: 'available',
          lastUpdated: serverTimestamp()
        });
      }

      // Update booking status
      await updateDoc(bookingRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
      });

      // Refresh bookings
      fetchBookings();
      
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <Typography>Loading bookings...</Typography>;
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
              <TableCell>Guest</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  {booking.roomDetails ? (
                    `${booking.roomDetails.roomNumber} - ${booking.roomDetails.type}`
                  ) : (
                    'Room details not available'
                  )}
                </TableCell>
                <TableCell>{booking.guestName}</TableCell>
                <TableCell>
                  {new Date(booking.checkInDate.seconds * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.checkOutDate.seconds * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={booking.status === 'cancelled'}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookingList; 