// Get session data securely
import { sessions } from './create';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get session token from cookie or header
        // In Next.js, cookies are parsed automatically
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

        // Return session data (excluding sensitive tokens in response)
        return res.status(200).json({
            success: true,
            data: {
                bookingId: sessionData.bookingId,
                slug: sessionData.slug,
                plotNo: sessionData.plotNo,
                currentStep: sessionData.currentStep,
                kycDetails: sessionData.kycDetails,
                // Don't return accessToken or sessionId directly
            }
        });
    } catch (error) {
        console.error('Error getting session:', error);
        return res.status(500).json({ error: 'Failed to get session' });
    }
}