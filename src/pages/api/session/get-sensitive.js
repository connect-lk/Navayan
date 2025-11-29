// Get sensitive session data (accessToken, sessionId) for API calls only
// This should only be used server-side or in secure API routes
import { sessions } from './create';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
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

        // Return sensitive data only (for API calls)
        return res.status(200).json({
            success: true,
            data: {
                accessToken: sessionData.accessToken,
                sessionId: sessionData.sessionId,
            }
        });
    } catch (error) {
        console.error('Error getting sensitive session data:', error);
        return res.status(500).json({ error: 'Failed to get sensitive session data' });
    }
}