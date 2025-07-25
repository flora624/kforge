// components/ChatInterface.js
import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const ChatMessage = ({ message, currentUser }) => {
    const isSender = currentUser && message.userId === currentUser.uid;
    const messageStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSender ? 'flex-end' : 'flex-start',
        marginBottom: '12px'
    };
    const bubbleStyle = {
        background: isSender ? '#3b82f6' : '#e5e7eb',
        color: isSender ? 'white' : '#1f2937',
        padding: '10px 16px',
        borderRadius: '18px',
        maxWidth: '70%',
        wordWrap: 'break-word'
    };
    const senderNameStyle = {
        fontSize: '0.75rem',
        color: '#6b7280',
        marginBottom: '4px',
        marginLeft: isSender ? 0 : '4px',
        marginRight: isSender ? '4px' : 0
    };
    return (
        <div style={messageStyle}>
            <span style={senderNameStyle}>
                {isSender ? 'You' : message.userName || 'Anonymous'}
            </span>
            <div style={bubbleStyle}>{message.text}</div>
        </div>
    );
};

export default function ChatInterface({ channelId }) {
  const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 🔐 Setup Firestore listener safely
    useEffect(() => {
        if (!user || !user.uid || !channelId) {
            console.warn("⚠️ Skipping Firestore listener: missing user or channelId");
            return;
        }

        const q = query(
            collection(db, 'chats'),
            where('channel', '==', channelId),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(data);
            },
            (error) => {
                console.error(`❌ Firestore error in channel ${channelId}:`, error.message);
                setMessages([]);
            }
        );

        return () => unsubscribe();
    }, [channelId, user]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (!user || !user.uid) {
            alert("You must be logged in to send a message.");
            return;
        }

        const messageData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            channel: channelId,
            userId: user.uid,
            userName: user.displayName || user.email,
            userPhotoURL: user.photoURL || null,
        };

        try {
            await addDoc(collection(db, 'chats'), messageData);
            setNewMessage('');
        } catch (error) {
            console.error("CRITICAL: Error sending message to Firestore:", error);
            alert(`Could not send message. Error: ${error.message}`);
        }
    };

    if (!user) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h3>Please log in to join the conversation.</h3>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '70vh',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
        }}>
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {messages.length > 0
                    ? messages.map(msg => (
                        <ChatMessage key={msg.id} message={msg} currentUser={user} />
                    ))
                    : <p style={{ textAlign: 'center', color: '#6b7280' }}>Be the first to say something!</p>}
                <div ref={messagesEndRef} />
            </div>
            <div style={{
                padding: '20px',
                borderTop: '1px solid #e5e7eb',
                background: '#f9fafb'
            }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message in #${channelId}...`}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db'
                        }}
                    />
                    <button type="submit" style={{
                        background: '#3b82f6',
                        color: 'white',
                        fontWeight: '600',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
