import { NextResponse } from 'next/server';
import clientPromise from '~/lib/mongodb'; // Corrected import path
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { senderId, recipientId, content } = await request.json();

    if (!senderId || !recipientId || !content) {
      return NextResponse.json({ message: 'Sender ID, recipient ID, and content are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const messagesCollection = db.collection('messages'); // Collection for messages

    const newMessage = {
      senderId: new ObjectId(senderId),
      recipientId: new ObjectId(recipientId),
      content,
      timestamp: new Date(),
      read: false,
    };

    const result = await messagesCollection.insertOne(newMessage);

    if (!result.insertedId) {
      return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent successfully', _id: result.insertedId.toHexString() }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationPartnerId = searchParams.get('conversationPartnerId');

    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const messagesCollection = db.collection('messages');

    let query: any = {};

    if (userId && conversationPartnerId) {
      // Fetch conversation between two users
      query = {
        $or: [
          { senderId: new ObjectId(userId), recipientId: new ObjectId(conversationPartnerId) },
          { senderId: new ObjectId(conversationPartnerId), recipientId: new ObjectId(userId) },
        ],
      };
    } else if (userId) {
      // Fetch all messages for a user (inbox/sent)
      query = {
        $or: [
          { senderId: new ObjectId(userId) },
          { recipientId: new ObjectId(userId) },
        ],
      };
    } else {
      return NextResponse.json({ message: 'User ID is required to fetch messages' }, { status: 400 });
    }

    const messages = await messagesCollection.find(query).sort({ timestamp: 1 }).toArray();

    // Convert ObjectId fields to strings for frontend consumption
    // Define an interface for the message document from MongoDB
    interface MessageDocument {
      _id: ObjectId;
      senderId: ObjectId;
      recipientId: ObjectId;
      content: string;
      timestamp: Date;
      read: boolean;
      // Add other fields if necessary
    }

    const formattedMessages = messages.map((msg: MessageDocument) => ({
      ...msg,
      _id: msg._id.toHexString(),
      senderId: msg.senderId.toHexString(),
      recipientId: msg.recipientId.toHexString(),
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}