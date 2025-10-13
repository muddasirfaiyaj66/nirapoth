import { z } from "zod";
import { UserRole } from "../store/slices/authSlice";

// User registration validation schema
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(50, "First name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(50, "Last name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

    email: z
      .string()
      .email("Please provide a valid email address")
      .max(100, "Email must not exceed 100 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmPassword: z.string(),

    phone: z
      .string()
      .regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number")
      .min(10, "Phone number must be at least 10 characters")
      .max(20, "Phone number must not exceed 20 characters"),

    nidNo: z
      .string()
      .regex(/^\d{10}$|^\d{17}$/, "NID must be either 10 or 17 digits")
      .optional()
      .or(z.literal("")),

    birthCertificateNo: z
      .string()
      .regex(/^\d{17}$/, "Birth Certificate Number must be 17 digits")
      .optional()
      .or(z.literal("")),

    role: z.nativeEnum(UserRole).optional().default(UserRole.CITIZEN),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// User login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .max(100, "Email must not exceed 100 characters"),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must not exceed 128 characters"),
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .max(100, "Email must not exceed 100 characters"),
});

// Reset password validation schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Change password validation schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .max(128, "New password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

// Update user profile validation schema
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .optional(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
    .optional(),

  phone: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number")
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must not exceed 20 characters")
    .optional(),

  nidNo: z
    .string()
    .regex(/^\d{10}$|^\d{17}$/, "NID must be either 10 or 17 digits")
    .optional()
    .or(z.literal("")),

  birthCertificateNo: z
    .string()
    .regex(/^\d{17}$/, "Birth Certificate Number must be 17 digits")
    .optional()
    .or(z.literal("")),

  profileImage: z.string().url("Profile image must be a valid URL").optional(),
});

// Type inference for the schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
