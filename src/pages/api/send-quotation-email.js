import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    try {
        const { quotationData, customerEmail, customerName, paymentDetails, pdfBase64 } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!quotationData) {
            return res.status(400).json({
                success: false,
                error: "Quotation data is required"
            });
        }

        // Get admin email from environment variable
        const adminEmail = process.env.ADMIN_EMAIL;

        // Validate customer email (optional - if not provided, only send to admin)
        let validCustomerEmail = null;
        if (customerEmail && customerEmail.trim() !== "" && emailRegex.test(customerEmail.trim())) {
            validCustomerEmail = customerEmail.trim();
        }

        // At least one email (customer or admin) must be valid
        if (!validCustomerEmail && !adminEmail) {
            console.error("No valid email addresses found. Customer:", customerEmail, "Admin:", adminEmail);
            return res.status(400).json({
                success: false,
                error: "At least one valid email address (customer or admin) is required",
                receivedCustomerEmail: customerEmail || "undefined",
                adminEmail: adminEmail || "undefined"
            });
        }

        // SMTP Configuration
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "business140.web-hosting.com",
            port: parseInt(process.env.EMAIL_PORT || "465"),
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Generate PDF
        // Note: We need to import QuotationPDF dynamically or use a different approach
        // For server-side PDF generation, we might need to use a different library
        // For now, let's create the PDF on the client side and send it as base64

        // If PDF is sent as base64 from client
        let pdfBuffer = null;
        if (pdfBase64) {
            pdfBuffer = Buffer.from(pdfBase64, 'base64');
        }

        // Prepare recipient emails (customer and admin)
        const recipients = [];
        if (validCustomerEmail) {
            recipients.push(validCustomerEmail);
        }
        if (adminEmail && emailRegex.test(adminEmail)) {
            recipients.push(adminEmail);
        }

        // Email content
        const mailOptions = {
                from: `"${process.env.SMTP_FROM_NAME || 'Navayan Properties'}" <${process.env.EMAIL_USER}>`,
                to: recipients.join(', '), // Send to both customer and admin
                subject: `Quotation ${quotationData.quotationNumber} - Navayan Properties`,
                html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #066fa9; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background-color: #066fa9; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Successful!</h1>
            </div>
            <div class="content">
              <p>Dear ${customerName || 'Valued Customer'},</p>
              <p>Thank you for your payment. Your payment has been successfully processed.</p>
              <p><strong>Payment Details:</strong></p>
              <ul>
                <li>Quotation Number: ${quotationData.quotationNumber}</li>
                <li>Date: ${quotationData.date}</li>
                <li>Total Amount: ₹${quotationData.costs.total.toLocaleString('en-IN')}</li>
                ${paymentDetails?.paymentId ? `<li><strong>Transaction ID:</strong> ${paymentDetails.paymentId}</li>` : ''}
                ${paymentDetails?.orderId ? `<li><strong>Order ID:</strong> ${paymentDetails.orderId}</li>` : ''}
              </ul>
              <p>Please find your quotation attached to this email.</p>
              <p>If you have any questions, please feel free to contact us.</p>
              <p>Best regards,<br>Navayan Properties Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
            attachments: pdfBuffer ? [{
                filename: `Quotation_${quotationData.quotationNumber}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            }] : [],
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully to:", recipients.join(', '), "Message ID:", info.messageId);

        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
            messageId: info.messageId,
            recipients: recipients
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to send email"
        });
    }
}