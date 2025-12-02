import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { z } from 'zod';
import { generateToken } from '@/app/lib/jwt';
import type { User } from '@/app/lib/definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Validation schema for login request
const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const users = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return users[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validationResult = LoginSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Get user from database
    const user = await getUser(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Create user data without password
    const userData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Create response with token
    const response = NextResponse.json({
      message: 'Login successful',
      token,
      user: userData,
    });

    // Set httpOnly cookie for additional security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
