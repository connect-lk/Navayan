// Update session data
import { sessions } from './create';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const cookies = req.cookies || {};
        const sessionToken = cookies.booking_session || req.headers['x-session-token'];

        if (!sessionToken) {
            return res.status(401).json({ error: 'No session found' });
        }

        const sessionData = sessions.get(sessionToken);

        if (!sessionData) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        // Check if session expired
        if (sessionData.expiresAt < Date.now()) {
            sessions.delete(sessionToken);
            return res.status(401).json({ error: 'Session expired' });
        }

        // Update session data
        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                sessionData[key] = updates[key];
            }
        });

        sessions.set(sessionToken, sessionData);

        return res.status(200).json({
            success: true,
            message: 'Session updated successfully'
        });
    } catch (error) {
        console.error('Error updating session:', error);
        return res.status(500).json({ error: 'Failed to update session' });
    }
}