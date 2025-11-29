// Secure session management - Create session
// Stores sensitive data server-side instead of localStorage

// In-memory session store (in production, use Redis or database)
const sessions = new Map();

// Session expiry: 24 hours
const SESSION_EXPIRY = 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { bookingId, slug, kycDetails, accessToken, sessionId, plotNo, currentStep } = req.body;

        // Generate secure session token
        const sessionToken = generateSecureToken();

        // Store session data
        const sessionData = {
            bookingId,
            slug,
            kycDetails,
            accessToken,
            sessionId,
            plotNo,
            currentStep: currentStep || 2,
            createdAt: Date.now(),
            expiresAt: Date.now() + SESSION_EXPIRY,
        };

        sessions.set(sessionToken, sessionData);

        // Clean up expired sessions periodically
        cleanupExpiredSessions();

        // Set secure httpOnly cookie
        res.setHeader('Set-Cookie', [
            `booking_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_EXPIRY / 1000}`
        ]);

        return res.status(200).json({
            success: true,
            sessionToken,
            message: 'Session created successfully'
        });
    } catch (error) {
        console.error('Error creating session:', error);
        return res.status(500).json({ error: 'Failed to create session' });
    }
}

function generateSecureToken() {
    // Generate cryptographically secure random token using Node.js crypto
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
}

function cleanupExpiredSessions() {
    const now = Date.now();
    for (const [token, data] of sessions.entries()) {
        if (data.expiresAt < now) {
            sessions.delete(token);
        }
    }
}

// Export sessions map for use in other API routes
export { sessions };