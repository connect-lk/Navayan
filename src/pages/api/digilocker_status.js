export default async function handler(req, res) {
  try {
    const { session_id, access_token } = req.query;

    if (!session_id) return res.status(400).json({ error: "Missing session_id" });
    if (!access_token) return res.status(400).json({ error: "Missing access_token" });

    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("authorization", access_token);
    myHeaders.append("x-api-key", process.env.NEXT_PUBLIC_SANDBOX_API_KEY);

    const digiResponse = await fetch(
      `https://api.sandbox.co.in/kyc/digilocker/sessions/${session_id}/status`,
      { method: "GET", headers: myHeaders }
    );

    const digiData = await digiResponse.json();

    // ---- Calculate expiry: 1 hour after created_at ----
    const createdAt = digiData?.data?.created_at; // timestamp in ms
    const oneHour = 60 * 60 * 1000; // 1 hour in ms
    const expiryAt = createdAt ? createdAt + oneHour : null;
    const isExpired = expiryAt ? Date.now() > expiryAt : false;

    // Log exact times
    console.log("Created At:", createdAt ? new Date(createdAt).toLocaleString() : null);
    console.log("Expiry At:", expiryAt ? new Date(expiryAt).toLocaleString() : null);
    console.log("Now:", new Date().toLocaleString());

    return res.status(200).json({
      ...digiData,
      sessionExpired: isExpired,
      expiryAt, // timestamp in ms
      expiryAtReadable: expiryAt ? new Date(expiryAt).toLocaleString() : null, // optional human-readable
    });

  } catch (error) {
    console.error("Digilocker status API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
