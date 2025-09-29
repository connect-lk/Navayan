export default async function handler(req, res) {
    try {
        const { slug } = req.body;

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
<<<<<<< HEAD
        console.log("accessToken::", authData);
=======
        console.log("accessToken::", authData)
>>>>>>> abe1e01116c2510c4b70c2cf82fd31c873b53086
        if (!accessToken) throw new Error("Failed to fetch access token");

        // Step 2: Prepare Digilocker init session headers
        const myHeaders = new Headers();
        myHeaders.append("Authorization", accessToken);
        myHeaders.append("x-api-key", process.env.NEXT_PUBLIC_SANDBOX_API_KEY);
        myHeaders.append("x-api-version", "v1");
        myHeaders.append("Content-Type", "application/json");

<<<<<<< HEAD
        // Consent expiry: 1 hour from now
        const oneHour = 60 * 60 * 1000;
        const consentExpiry = Date.now() + oneHour;

        // ✅ Restrict to Aadhaar only
        const raw = JSON.stringify({
            "@entity": "in.co.sandbox.kyc.digilocker.session.request",
            flow: "signin",
            doc_types: ["aadhaar"], // ✅ only Aadhaar
=======
        // Set custom consent expiry: 1 hour from now
        const oneHour = 60 * 60 * 1000; // milliseconds
        const consentExpiry = Date.now() + oneHour;

        const raw = JSON.stringify({
            "@entity": "in.co.sandbox.kyc.digilocker.session.request",
            flow: "signin",
            doc_types: ["aadhaar", "pan"],
>>>>>>> abe1e01116c2510c4b70c2cf82fd31c873b53086
            redirect_url: `http://localhost:4600/properties/${slug}`,
            options: {
                pinless: true,
                usernameless: true,
                verified_mobile: "9512120133",
<<<<<<< HEAD
                verification_method: ["aadhaar"], // ✅ only Aadhaar
            },
            consent_expiry: consentExpiry,
=======
                verification_method: [
                    "driving_license",
                    "aadhaar",
                    "pan",
                    "email",
                    "username",
                    "mobile",
                    "other",
                ],
            },  
>>>>>>> abe1e01116c2510c4b70c2cf82fd31c873b53086
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

<<<<<<< HEAD
        // Return to frontend
        res.status(200).json({
            digiData,
            accessToken,
            consentExpiry,
            consentExpiryReadable: new Date(consentExpiry).toLocaleString(),
=======
        // Return the authorization_url and consent_expiry to frontend
        res.status(200).json({
            digiData,
            accessToken,
            consentExpiry, // timestamp in ms
            consentExpiryReadable: new Date(consentExpiry).toLocaleString(), // human-readable
>>>>>>> abe1e01116c2510c4b70c2cf82fd31c873b53086
        });
    } catch (error) {
        console.error("Digilocker API error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}