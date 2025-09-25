export default async function handler(req, res) {
  try {
    const { slug } = req.body;

    // Step 1: Get dynamic access token
    const authHeaders = new Headers();
    authHeaders.append("x-api-key", process.env.NEXT_PUBLIC_SANDBOX_API_KEY);
    authHeaders.append(
      "x-api-secret",
      process.env.NEXT_PUBLIC_SANDBOX_SECRET_KEY
    );
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

    // ✅ Consent expiry: 1 hour from now (in SECONDS, not ms)
    const oneHour = 60 * 60; // seconds
    const consentExpiry = Math.floor(Date.now() / 1000) + oneHour;
    const raw = JSON.stringify({
      "@entity": "in.co.sandbox.kyc.digilocker.session.request",
      flow: "signin",
      doc_types: ["aadhaar", "pan"],
      redirect_url: `http://localhost:4600/properties/${slug}`,
      options: {
        pinless: true,
        usernameless: true,
        verified_mobile: "9512120133",
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
      consent_expiry: consentExpiry, // ✅ API expects seconds
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

    // Step 3: Return to frontend
    res.status(200).json({
      digiData,
      accessToken,
      consentExpiry, // seconds
      consentExpiryReadable: new Date(consentExpiry * 1000).toLocaleString(), // convert back to ms for display
    });
  } catch (error) {
    console.error("Digilocker API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
