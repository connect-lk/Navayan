// Client-side session management utility
// Replaces localStorage with secure server-side sessions

class SessionManager {
    // Create or update session
    static async createSession(data) {
        try {
            const response = await fetch('/api/session/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for cookies
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to create session');
            }
            return result;
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    // Get session data
    static async getSession() {
        try {
            const response = await fetch('/api/session/get', {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                return null; // No session found
            }
            return result.data;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    }

    // Update session data
    static async updateSession(updates) {
        try {
            const response = await fetch('/api/session/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to update session');
            }
            return result;
        } catch (error) {
            console.error('Error updating session:', error);
            throw error;
        }
    }

    // Delete session (logout)
    static async deleteSession() {
        try {
            const response = await fetch('/api/session/delete', {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error;
        }
    }

    // Get sensitive data (accessToken, sessionId) - only for API calls
    static async getSensitiveData() {
        try {
            const response = await fetch('/api/session/get-sensitive', {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();
            if (!response.ok) {
                return null;
            }
            return result.data;
        } catch (error) {
            console.error('Error getting sensitive data:', error);
            return null;
        }
    }

    // Validate booking access
    static async validateBooking(bookingId, slug) {
        try {
            const response = await fetch('/api/booking/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ bookingId, slug }),
            });

            const result = await response.json();
            return result.valid === true;
        } catch (error) {
            console.error('Error validating booking:', error);
            return false;
        }
    }

    // Generate encrypted token for URL
    static async generateBookingToken(bookingId, slug) {
        try {
            const response = await fetch('/api/booking/encrypt-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ bookingId, slug }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate token');
            }
            return result.token;
        } catch (error) {
            console.error('Error generating booking token:', error);
            throw error;
        }
    }

    // Decrypt token from URL
    static async decryptBookingToken(token) {
        try {
            const response = await fetch('/api/booking/decrypt-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ token }),
            });

            const result = await response.json();
            if (!response.ok || !result.valid) {
                return null;
            }
            return result.data;
        } catch (error) {
            console.error('Error decrypting booking token:', error);
            return null;
        }
    }
}

export default SessionManager;