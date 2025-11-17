import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../../config/database';
import { user } from '../../config/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {  userEmail, password } = req.body;

    if ( !userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where((eq(user.email, userEmail)))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User name or user email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await db
      .insert(user)
      .values({
        email: userEmail,
        password: hashedPassword,
        is_instructor: false,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { userEmail, password } = req.body;

    // Validate input
    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user
    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .limit(1);

    if (foundUser.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const userData = foundUser[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        id: userData.id,
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' }
    );

    const {password:p, ...rest} = userData;  // returning without password
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        accessToken,
        user: rest,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getUserById = async (id: number) => {
  const existingUser = await db
    .select()
    .from(user)
    .where((eq(user.id, id)))
    .limit(1);
   return existingUser[0];
}