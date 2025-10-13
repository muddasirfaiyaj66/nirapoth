# Authentication System Documentation

This document outlines the complete authentication system implementation for the Nirapoth frontend application.

## Overview

The authentication system is built using:

- **Next.js 14** with App Router
- **Redux Toolkit** for state management
- **Tanstack Query** for API calls and caching
- **React Hook Form** with Zod validation
- **Cloudinary** for media uploads
- **JWT tokens** with httpOnly cookies for security

## Architecture

### State Management

- **Redux Store**: Centralized authentication state
- **Auth Slice**: Handles all authentication actions and state
- **Custom Hooks**: `useAuth` hook for easy component integration

### API Layer

- **Axios Instance**: Configured with interceptors for token refresh
- **API Services**: Modular functions for each authentication endpoint
- **Error Handling**: Comprehensive error handling and user feedback

### Security Features

- **HttpOnly Cookies**: Secure token storage
- **Automatic Token Refresh**: Seamless user experience
- **CSRF Protection**: Built-in security measures
- **Input Validation**: Client and server-side validation

## Components

### Authentication Forms

- `LoginForm`: User login with email/password
- `RegisterForm`: User registration with comprehensive validation
- `ForgotPasswordForm`: Password reset request
- `ResetPasswordForm`: Password reset with token
- `EmailVerification`: Email verification handling

### Utility Components

- `UserProfile`: User profile management with image upload
- `ProtectedRoute`: Route protection wrapper
- `EmailVerification`: Email verification component

## API Endpoints

The system integrates with the following backend endpoints:

```
POST /api/auth/register          - User registration
POST /api/auth/login             - User login
POST /api/auth/logout             - User logout
POST /api/auth/refresh            - Token refresh
GET  /api/auth/me                 - Get current user
GET  /api/auth/verify-email       - Email verification
POST /api/auth/forgot-password    - Password reset request
POST /api/auth/reset-password     - Password reset
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Usage Examples

### Using the useAuth Hook

```tsx
import { useAuth } from "@/lib/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading, error } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: "user@example.com",
      password: "password",
    });
    if (result.success) {
      // Handle successful login
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### Form Validation

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
}
```

## File Upload with Cloudinary

```tsx
import { useFileUpload } from "@/lib/cloudinary/upload";

function ImageUpload() {
  const { uploadFile } = useFileUpload();

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadFile(file, {
        folder: "profile-images",
        transformation: { width: 200, height: 200, crop: "fill" },
      });
      console.log("Uploaded:", result.url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
    />
  );
}
```

## Pages

### Authentication Pages

- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset with token
- `/verify-email` - Email verification

### Protected Pages

- `/dashboard` - Main dashboard (protected)
- `/profile` - User profile management (protected)

## Security Considerations

1. **Token Storage**: JWT tokens are stored in httpOnly cookies
2. **Automatic Refresh**: Tokens are automatically refreshed before expiration
3. **Input Validation**: All inputs are validated on both client and server
4. **CSRF Protection**: Built-in protection against CSRF attacks
5. **Rate Limiting**: Backend implements rate limiting for auth endpoints

## Error Handling

The system provides comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **Validation Errors**: Real-time form validation feedback
- **Authentication Errors**: Clear error messages for users
- **Token Expiry**: Automatic token refresh and fallback to login

## Testing

To test the authentication system:

1. **Registration Flow**:

   - Navigate to `/signup`
   - Fill out the registration form
   - Check email for verification link
   - Click verification link

2. **Login Flow**:

   - Navigate to `/login`
   - Enter credentials
   - Should redirect to `/dashboard`

3. **Password Reset Flow**:

   - Navigate to `/forgot-password`
   - Enter email address
   - Check email for reset link
   - Navigate to reset link and set new password

4. **Profile Management**:
   - Navigate to `/profile`
   - Update profile information
   - Upload profile image
   - Test logout functionality

## Troubleshooting

### Common Issues

1. **API Connection Issues**:

   - Verify `NEXT_PUBLIC_API_BASE_URL` is correct
   - Ensure backend server is running
   - Check CORS configuration

2. **Cloudinary Upload Issues**:

   - Verify Cloudinary credentials
   - Check upload preset configuration
   - Ensure proper CORS settings

3. **Token Issues**:
   - Clear browser cookies
   - Check token expiration
   - Verify backend token validation

### Debug Mode

Enable debug mode by adding to your environment:

```env
NEXT_PUBLIC_DEBUG=true
```

This will provide additional logging for troubleshooting.

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login integration
- [ ] Advanced role-based permissions
- [ ] Session management
- [ ] Audit logging
- [ ] Advanced security features

## Support

For issues or questions regarding the authentication system, please refer to the main project documentation or create an issue in the project repository.
