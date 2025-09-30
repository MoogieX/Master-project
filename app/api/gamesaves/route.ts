import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { gameId, userId, saveName, data } = await request.json();

    if (!gameId || !userId || !saveName || !data) {
      return NextResponse.json({ message: 'Game ID, User ID, Save Name, and Data are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const gameSavesCollection = db.collection('gamesaves'); // Collection for game saves

    const newGameSave = {
      gameId,
      userId: new ObjectId(userId),
      saveName,
      timestamp: new Date(),
      data,
    };

    const result = await gameSavesCollection.insertOne(newGameSave);

    if (!result.insertedId) {
      return NextResponse.json({ message: 'Failed to save game' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game saved successfully', _id: result.insertedId.toHexString() }, { status: 201 });
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const gameId = searchParams.get('gameId');
    const saveId = searchParams.get('saveId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const gameSavesCollection = db.collection('gamesaves');

    let query: any = { userId: new ObjectId(userId) };

    if (gameId) {
      query.gameId = gameId;
    }
    if (saveId) {
      query._id = new ObjectId(saveId);
    }

    const gameSaves = await gameSavesCollection.find(query).sort({ timestamp: -1 }).toArray();

    // Convert ObjectId fields to strings for frontend consumption
    const formattedGameSaves = gameSaves.map(save => ({
      ...save,
      _id: save._id.toHexString(),
      userId: save.userId.toHexString(),
    }));

    return NextResponse.json(formattedGameSaves);
  } catch (error) {
    console.error('Error fetching game saves:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}