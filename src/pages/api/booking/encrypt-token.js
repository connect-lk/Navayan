// Generate encrypted token for booking URLs
// This replaces direct IDs in URLs with secure tokens

// Simple encryption using base64 encoding (in production, use proper encryption)
// For production, use crypto library with proper encryption

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { bookingId, slug } = req.body;

        if (!bookingId || !slug) {
            return res.status(400).json({ error: 'Missing bookingId or slug' });
        }

        // Create token payload with timestamp for expiry
        const payload = {
            bookingId,
            slug,
            timestamp: Date.now(),
            // Add random salt to prevent token guessing
            salt: Math.random().toString(36).substring(2, 15)
        };

        // Encode to base64 (in production, use proper encryption like AES)
        const token = Buffer.from(JSON.stringify(payload)).toString('base64url');

        return res.status(200).json({
            success: true,
            token,
            // Token expires in 24 hours
            expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        });
    } catch (error) {
        console.error('Error encrypting token:', error);
        return res.status(500).json({ error: 'Failed to encrypt token' });
    }
}