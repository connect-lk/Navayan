export default async function handler(req, res) {
    try {
        const { slug, bookingId } = req.body;

        // Step 1: Get dynamic access token
        const authHeaders = new Headers();
        authHeaders.append("x-api-key", process.env.NEXT_PUBLIC_SANDBOX_API_KEY);
        authHeaders.append("x-api-secret", process.env.NEXT_PUBLIC_SANDBOX_SECRET_KEY);
        authHeaders.append("x-api-version", "v1");

        const authResponse = await fetch("https://api.sandbox.co.in/authenticate", {
            method: "POST",
            headers: authHeaders,
        });

        const authData = await authResponse.json();
        const accessToken = authData.access_token || authData.accessToken;
        console.log("accessToken::", authData);
        if (!accessToken) throw new Error("Failed to fetch access token");

        // Step 2: Prepare Digilocker init session headers
        const myHeaders = new Headers();
        myHeaders.append("Authorization", accessToken);
        myHeaders.append("x-api-key", process.env.NEXT_PUBLIC_SANDBOX_API_KEY);
        myHeaders.append("x-api-version", "v1");
        myHeaders.append("Content-Type", "application/json");

        // Consent expiry: 1 hour from now
        const oneHour = 60 * 60 * 1000;
        const consentExpiry = Date.now() + oneHour;

        // ✅ Restrict to Aadhaar only
        const raw = JSON.stringify({
            "@entity": "in.co.sandbox.kyc.digilocker.session.request",
            flow: "signin",
            doc_types: ["aadhaar"], // ✅ only Aadhaar
            redirect_url: `http://localhost:4600/properties/${slug}/bookingproperties/${bookingId}`,
            options: {
                pinless: true,
                usernameless: true,
                verified_mobile: "9512120133",
                verification_method: ["aadhaar"], // ✅ only Aadhaar
            },
            consent_expiry: consentExpiry,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        const digiResponse = await fetch(
            "https://api.sandbox.co.in/kyc/digilocker/sessions/init",
            requestOptions
        );

        const digiData = await digiResponse.json();

        // Return to frontend
        res.status(200).json({
            digiData,
            accessToken,
            consentExpiry,
            consentExpiryReadable: new Date(consentExpiry).toLocaleString(),
        });
    } catch (error) {
        console.error("Digilocker API error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}