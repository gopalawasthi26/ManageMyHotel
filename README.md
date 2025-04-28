# Hotel Management Portal

A modern and user-friendly hotel management system built with React, Vite, and Firebase. This application provides separate interfaces for hotel staff and guests, allowing efficient management of rooms, bookings, and cleaning schedules.

## Important Notes

### Ad Blockers and Security Extensions
If you're experiencing issues with the application (such as rooms not loading or booking errors), please check if you have any ad blockers or security extensions enabled. These may interfere with the application's functionality. To resolve this:

1. Disable your ad blocker for this site
2. If using a security extension, add an exception for this domain
3. Refresh the page after making these changes

## Features

### For Guests
- User registration and authentication
- View available rooms with detailed information
- Book rooms with flexible check-in/check-out dates
- View booking history and manage reservations
- User dashboard with booking statistics

### For Staff
- Staff authentication and authorization
- Room management (add, edit, delete rooms)
- Booking management (view, update, cancel bookings)
- Cleaning schedule management
- Dashboard with key metrics and statistics

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd hotel-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage (optional, for room images)

4. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/         # Reusable components
├── contexts/          # React contexts
├── firebase/          # Firebase configuration
├── pages/            # Page components
│   ├── auth/         # Authentication pages
│   ├── staff/        # Staff dashboard pages
│   └── user/         # User dashboard pages
└── App.jsx           # Main application component
```

## Technologies Used

- React
- Vite
- Firebase (Authentication, Firestore)
- Material-UI
- React Router
- Formik & Yup
- React Toastify
- Date-fns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
