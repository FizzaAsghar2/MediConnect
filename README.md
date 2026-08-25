# MediConnect – Telemedicine Platform

MediConnect is a full-stack telemedicine platform that connects patients with doctors online. Patients can discover doctors, check their availability, and book appointments, while doctors can manage their profiles and appointment requests.

## 🚀 Features

### 👤 Patient Features
- Patient registration and login
- Secure authentication with Supabase
- Patient dashboard
- View available doctors
- Search doctors by name or specialty
- View doctor specialty and experience
- Check doctor availability
- Book appointments
- View appointment history
- Track appointment status
- Cancel appointments
- Responsive dashboard

### 👨‍⚕️ Doctor Features
- Doctor registration and login
- Secure authentication
- Doctor dashboard
- Doctor profile management
- Add/edit professional information
- Manage availability
- View appointment requests
- Approve appointments
- Cancel appointments
- Track appointment status

### 🔐 Security
- Supabase Authentication
- Protected routes
- Patient and doctor role-based access
- Row Level Security (RLS)
- User-specific database access
- Secure patient/doctor relationships

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router
- React Icons

### Backend / Database
- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

### Development Tools
- Visual Studio Code
- Git
- GitHub
- npm

## 📋 Main User Flow

### Patient

Register/Login  
↓  
Patient Dashboard  
↓  
Find Doctors  
↓  
Search / Filter Doctor  
↓  
View Doctor Information  
↓  
Book Appointment  
↓  
Appointment Status  
↓  
Cancel Appointment if needed

### Doctor

Register/Login  
↓  
Doctor Dashboard  
↓  
Complete Profile  
↓  
Manage Availability  
↓  
View Appointment Requests  
↓  
Approve / Cancel Appointment  
↓  
Manage Appointments

## 📁 Project Structure

```text
src/
│
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── protected/
│   └── ...
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   └── useProfile.js
│
├── lib/
│   └── supabase.js
│
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── BookAppointment.jsx
│   ├── Doctors.jsx
│   └── ...
│
├── styles/
│   ├── dashboard.css
│   ├── bookAppointment.css
│   └── ...
│
├── App.jsx
└── main.jsxgit add README.md