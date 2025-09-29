import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const usersCollection = db.collection('users'); // Collection for user profiles

    if (userId) {
      const userProfile = await usersCollection.findOne({ _id: new ObjectId(userId) });

      if (!userProfile) {
        return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
      }
      return NextResponse.json(userProfile);
    } else {
      // If no userId is provided, fetch all users (or a subset for a public list)
      const allUsers = await usersCollection.find({}).project({ _id: 1, username: 1, profilePictureUrl: 1 }).toArray();
      const formattedUsers = allUsers.map(u => ({
        _id: u._id.toHexString(),
        username: u.username,
        profilePictureUrl: u.profilePictureUrl,
      }));
      return NextResponse.json(formattedUsers);
    }
  } catch (error) {
    console.error('Error fetching user profile(s):', error);
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

    // Remove _id from updatedProfile to prevent issues with $set
    const { _id, ...profileToUpdate } = updatedProfile;

    // Prevent guest account from changing profile picture
    if (userId === '65f2a1b3c4d5e6f7a8b9c0d3' && profileToUpdate.profilePictureUrl) {
      return NextResponse.json({ message: 'Guest account cannot change profile picture' }, { status: 403 });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: profileToUpdate } // Use profileToUpdate without _id
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

export async function POST(request: Request) {
  try {
    const newUserProfile = await request.json();

    if (!newUserProfile || !newUserProfile._id || !newUserProfile.username) {
      return NextResponse.json({ message: 'Invalid user profile data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const usersCollection = db.collection('users');

    // Ensure _id is an ObjectId before inserting
    const profileToInsert = {
      ...newUserProfile,
      _id: new ObjectId(newUserProfile._id),
    };

    const result = await usersCollection.insertOne(profileToInsert);

    if (!result.insertedId) {
      return NextResponse.json({ message: 'Failed to create user profile' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User profile created successfully', _id: result.insertedId.toHexString() }, { status: 201 });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}