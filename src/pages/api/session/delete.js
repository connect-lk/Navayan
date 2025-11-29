// Delete session (logout)
import { sessions } from './create';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const cookies = req.cookies || {};
        const sessionToken = cookies.booking_session || req.headers['x-session-token'];

        if (sessionToken) {
            sessions.delete(sessionToken);
        }

        // Clear cookie
        res.setHeader('Set-Cookie', [
            'booking_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
        ]);

        return res.status(200).json({
            success: true,
            message: 'Session deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting session:', error);
        return res.status(500).json({ error: 'Failed to delete session' });
    }
}