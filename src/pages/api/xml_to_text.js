import { parseStringPromise } from "xml2js";

export default async function handler(req, res) {
    try {
        // Get file URL from request query or body
        const { fileUrl } = req.body; // or req.query.fileUrl
        if (!fileUrl) return res.status(400).json({ error: "Missing fileUrl" });

        // Fetch the XML file
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("Failed to fetch XML file");

        const xmlText = await response.text();

        // Convert XML to JavaScript object
        const jsonObj = await parseStringPromise(xmlText, { explicitArray: false });

        // Return JSON object
        res.status(200).json({ data: jsonObj });

    } catch (error) {
        console.error("Error parsing XML:", error);
        res.status(500).json({ error: "Failed to parse XML file" });
    }
}