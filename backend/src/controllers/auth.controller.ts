import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db, User, FarmerProfile } from '../config/database.js';
import { ENV } from '../config/environment.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be a valid 10-digit number'),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  preferredLanguage: z.enum(['EN', 'HI']).default('HI'),
  state: z.string().optional().default('Maharashtra'),
  district: z.string().optional().default('Nashik'),
  village: z.string().optional().default(''),
  landSize: z.number().min(0).optional().default(2.5),
  soilType: z.string().optional().default('Alluvial / Loam'),
});

const loginSchema = z.object({
  identifier: z.string().min(3, 'Mobile number or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: parsed.error.issues,
        });
      }

      const { fullName, mobileNumber, email, password, preferredLanguage, state, district, village, landSize, soilType } = parsed.data;

      const existingMobile = db.users.find((u) => u.mobileNumber === mobileNumber);
      if (existingMobile) {
        return res.status(409).json({ success: false, message: 'A user with this mobile number already exists.' });
      }

      if (email && email.trim() !== '') {
        const existingEmail = db.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (existingEmail) {
          return res.status(409).json({ success: false, message: 'A user with this email address already exists.' });
        }
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const userId = `usr-${Date.now()}`;
      const newUser: User = {
        id: userId,
        fullName,
        mobileNumber,
        email: email && email.trim() !== '' ? email.toLowerCase() : null,
        passwordHash,
        role: 'FARMER',
        preferredLanguage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.users.push(newUser);

      const newProfile: FarmerProfile = {
        id: `prof-${Date.now()}`,
        userId,
        state: state || 'Maharashtra',
        district: district || 'Nashik',
        village: village || 'Gramin',
        landSize: landSize || 2.0,
        soilType: soilType || 'Loam Soil',
        irrigation: 'Well & Drip Irrigation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.farmerProfiles.push(newProfile);

      // Add default welcome notification
      db.notifications.push({
        id: `notif-${Date.now()}`,
        farmerId: userId,
        title: 'Welcome to AGRI-SETU! (कृषि-सेतु में आपका स्वागत है)',
        message: 'Your farmer profile is registered. Explore government schemes, crop health diagnostics, and real-time mandi prices.',
        type: 'SYSTEM',
        link: '/dashboard',
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      const token = jwt.sign({ id: newUser.id, role: newUser.role }, ENV.JWT_SECRET, {
        expiresIn: '7d',
      });

      const { passwordHash: _, ...safeUser } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to AGRI-SETU.',
        data: {
          token,
          user: {
            ...safeUser,
            profile: newProfile,
          },
        },
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid login details',
          errors: parsed.error.issues,
        });
      }

      const { identifier, password } = parsed.data;

      const user = db.users.find(
        (u) => u.mobileNumber === identifier || (u.email && u.email.toLowerCase() === identifier.toLowerCase())
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your mobile number or email and password.',
        });
      }

      const isMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password does not match.' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, ENV.JWT_SECRET, {
        expiresIn: '7d',
      });

      const profile = db.farmerProfiles.find((p) => p.userId === user.id) || null;
      const expertProfile = db.expertProfiles.find((e) => e.userId === user.id) || null;
      const { passwordHash: _, ...safeUser } = user;

      return res.json({
        success: true,
        message: `Welcome back, ${user.fullName}!`,
        data: {
          token,
          user: {
            ...safeUser,
            profile,
            expertProfile,
          },
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
  }

  static async logout(req: Request, res: Response) {
    return res.json({ success: true, message: 'Logged out successfully.' });
  }

  static async me(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const profile = db.farmerProfiles.find((p) => p.userId === req.user!.id) || null;
    const expertProfile = db.expertProfiles.find((e) => e.userId === req.user!.id) || null;
    const { passwordHash: _, ...safeUser } = req.user;

    return res.json({
      success: true,
      data: {
        ...safeUser,
        profile,
        expertProfile,
      },
    });
  }
}
