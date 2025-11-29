// Decrypt and validate booking token from URL
// This ensures URLs can't be directly manipulated

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Missing token' });
        }

        try {
            // Decode from base64
            const decoded = Buffer.from(token, 'base64url').toString('utf-8');
            const payload = JSON.parse(decoded);

            // Check if token expired (24 hours)
            const tokenAge = Date.now() - payload.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            if (tokenAge > maxAge) {
                return res.status(401).json({
                    error: 'Token expired',
                    valid: false
                });
            }

            return res.status(200).json({
                success: true,
                valid: true,
                data: {
                    bookingId: payload.bookingId,
                    slug: payload.slug
                }
            });
        } catch (decodeError) {
            return res.status(400).json({
                error: 'Invalid token',
                valid: false
            });
        }
    } catch (error) {
        console.error('Error decrypting token:', error);
        return res.status(500).json({
            error: 'Failed to decrypt token',
            valid: false
        });
    }
}