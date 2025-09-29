import { NextResponse } from 'next/server';
import clientPromise from '~/lib/mongodb'; // Corrected import path
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { senderId, content } = await request.json(); // Removed recipientId

    if (!senderId || !content) { // Removed recipientId from validation
      return NextResponse.json({ message: 'Sender ID and content are required' }, { status: 400 });
    }

    // Basic chat moderation: keyword filtering and censoring
    // Focus on slurs and highly offensive terms, censoring them into ****
    const forbiddenWords = [
      'nigger', 'nigga', // N-word variations
      'faggot', 'chink', 'paki', 'kike', 'coon', 'gook', 'spic', 'wetback', 'tranny',
      'slut', 'whore' // Added as requested
    ];
    let moderatedContent = content; // Start with original content

    for (const word of forbiddenWords) {
      // Create a regex to find the word globally and case-insensitively
      const regex = new RegExp(word, 'gi');
      moderatedContent = moderatedContent.replace(regex, '****');
    }

    // Use the moderatedContent for saving
    // If the content was entirely replaced by asterisks, you might want to reject it,
    // but for now, we'll just save the censored version.

    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const messagesCollection = db.collection('messages'); // Collection for messages

    const newMessage = {
      senderId: new ObjectId(senderId),
      // recipientId: new ObjectId(recipientId), // Removed recipientId
      content: moderatedContent, // Use the moderated content
      timestamp: new Date(),
      read: false,
      type: 'public_forum', // Add a type to distinguish public messages
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
    const client = await clientPromise;
    const db = client.db('gamehub'); // Replace 'gamehub' with your database name
    const messagesCollection = db.collection('messages');

    // Fetch all public forum messages
    const messages = await messagesCollection.find({ type: 'public_forum' }).sort({ timestamp: 1 }).toArray() as MessageDocument[];

    // Define an interface for the message document from MongoDB
    interface MessageDocument {
      _id: ObjectId;
      senderId: ObjectId;
      // recipientId: ObjectId; // Removed recipientId
      content: string;
      timestamp: Date;
      read: boolean;
      type: string; // Added type
      // Add other fields if necessary
    }

    // Convert ObjectId fields to strings for frontend consumption
    const formattedMessages = messages.map((msg: MessageDocument) => ({
      ...msg,
      _id: msg._id.toHexString(),
      senderId: msg.senderId.toHexString(),
      // recipientId: msg.recipientId.toHexString(), // Removed recipientId
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}