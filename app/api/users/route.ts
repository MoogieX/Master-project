import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const usersCollection = db.collection('users'); // Collection for user profiles

    const userProfile = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, updatedProfile } = await request.json();

    if (!userId || !updatedProfile) {
      return NextResponse.json({ message: 'User ID and updated profile are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const usersCollection = db.collection('users');

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedProfile }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}