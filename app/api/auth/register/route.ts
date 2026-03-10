import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration: Starting registration process');
    
    const body = await request.json();
    const { email, name, password } = body;

    console.log('Registration: Received data:', { email, name: name ? 'provided' : 'missing', password: password ? 'provided' : 'missing' });

    if (!email || !name || !password) {
      console.log('Registration: Missing required fields');
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('Registration: Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    console.log('Registration: Checking if user exists:', email);
    const existingUser = await UserService.emailExists(email);
    if (existingUser) {
      console.log('Registration: User already exists:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    console.log('Registration: Creating new user:', email);
    const user = await UserService.createUser({ email, name, password });
    console.log('Registration: User created successfully:', user.id);

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Registration error stack:', error instanceof Error ? error.stack : 'No stack available');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
