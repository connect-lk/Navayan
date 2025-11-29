import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    try {
        const { pdfBase64, bookingId } = req.body;

        if (!pdfBase64) {
            return res.status(400).json({
                success: false,
                error: "PDF base64 data is required"
            });
        }

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                error: "Booking ID is required"
            });
        }

        // Create quotations directory if it doesn't exist
        const quotationsDir = path.join(process.cwd(), 'public', 'quotations');
        if (!fs.existsSync(quotationsDir)) {
            fs.mkdirSync(quotationsDir, { recursive: true });
        }

        // Generate filename with bookingId
        const filename = `quotation_${bookingId}.pdf`;
        const filePath = path.join(quotationsDir, filename);

        // Convert base64 to buffer and save file
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        fs.writeFileSync(filePath, pdfBuffer);

        // Generate URL (adjust based on your domain)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4600';
        const pdfUrl = `${baseUrl}/quotations/${filename}`;

        console.log("PDF saved successfully:", filePath);
        console.log("PDF URL:", pdfUrl);

        return res.status(200).json({
            success: true,
            message: "PDF saved successfully",
            pdfUrl: pdfUrl,
            filename: filename
        });
    } catch (error) {
        console.error("Error saving PDF:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to save PDF"
        });
    }
}