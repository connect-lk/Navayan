// Validate booking access - ensures users can only access their own bookings
import { sessions } from '../session/create';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { bookingId, slug } = req.body;
        const cookies = req.cookies || {};
        const sessionToken = cookies.booking_session || req.headers['x-session-token'];

        if (!sessionToken) {
            return res.status(401).json({
                error: 'Unauthorized',
                valid: false
            });
        }

        const sessionData = sessions.get(sessionToken);

        if (!sessionData) {
            return res.status(401).json({
                error: 'Invalid session',
                valid: false
            });
        }

        // Check if session expired
        if (sessionData.expiresAt < Date.now()) {
            sessions.delete(sessionToken);
            return res.status(401).json({
                error: 'Session expired',
                valid: false
            });
        }

        // Validate that the bookingId and slug match the session
        const isValid =
            sessionData.bookingId === bookingId &&
            sessionData.slug === slug;

        if (!isValid) {
            return res.status(403).json({
                error: 'Access denied',
                valid: false
            });
        }

        return res.status(200).json({
            success: true,
            valid: true,
            data: {
                bookingId: sessionData.bookingId,
                slug: sessionData.slug,
                plotNo: sessionData.plotNo,
                currentStep: sessionData.currentStep,
            }
        });
    } catch (error) {
        console.error('Error validating booking:', error);
        return res.status(500).json({
            error: 'Failed to validate booking',
            valid: false
        });
    }
}