export default async function handler(req, res) {
    try {
        const { session_id, access_token } = req.query; // pass access_token from frontend
        if (!session_id) return res.status(400).json({ error: "Missing session_id" });
        if (!access_token) return res.status(400).json({ error: "Missing access_token" });

        const myHeaders = new Headers();
        myHeaders.append("Authorization", access_token); // dynamic
        myHeaders.append("x-api-key", "key_live_3b171e2fb0ca4c36a0c71cdca8ccacd4");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        // Fetch Aadhaar + PAN in parallel
        const [aadhaarRes, panRes] = await Promise.all([
            fetch(
                `https://api.sandbox.co.in/kyc/digilocker/sessions/${session_id}/documents/aadhaar`,
                requestOptions
            ),
            fetch(
                `https://api.sandbox.co.in/kyc/digilocker/sessions/${session_id}/documents/pan`,
                requestOptions
            ),
        ]);

        const [aadhaarData, panData] = await Promise.all([
            aadhaarRes.json(),
            panRes.json(),
        ]);
        console.log("aadhaarData", aadhaarData)
        console.log("panRes", panRes)
        res.status(200).json({
            aadhaar: aadhaarData,
            pan: panData,
        });
    } catch (error) {
        console.error("Digilocker document fetch error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}