import Razorpay from "razorpay";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    try {
        const { amount, checkNumber, bankName } = req.body;

        // Validate amount
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid amount. Amount must be a positive number."
            });
        }

        // Initialize Razorpay - Get credentials and trim any whitespace
        const keyId = (process.env.RAZORPAY_KEY_ID || "rzp_test_RkgYklrk2WT4fq").trim();
        const keySecret = (process.env.RAZORPAY_KEY_SECRET || "GwxS3pbGheD1HOPNjbjwOG92").trim();

        // Check if in test mode and validate amount limit
        // Razorpay test mode typically allows up to 1,00,000 INR (1 lakh)
        const isTestMode = keyId.startsWith("rzp_test_");
        const MAX_TEST_AMOUNT = 100000; // 1 lakh in INR

        if (isTestMode && amount > MAX_TEST_AMOUNT) {
            return res.status(400).json({
                success: false,
                error: `Amount exceeds test mode limit. Maximum allowed: ${MAX_TEST_AMOUNT.toLocaleString('en-IN')} INR`,
                details: `You are using test mode. The amount ${amount.toLocaleString('en-IN')} INR exceeds the test limit of ${MAX_TEST_AMOUNT.toLocaleString('en-IN')} INR.`,
                hint: "For testing, use amounts less than ₹1,00,000. For production, switch to live mode credentials."
            });
        }

        if (!keyId || !keySecret) {
            return res.status(500).json({
                success: false,
                error: "Razorpay credentials are missing"
            });
        }

        // Verify key format
        if (!keyId.startsWith("rzp_")) {
            console.error("Invalid Razorpay Key ID format. Should start with 'rzp_'");
            return res.status(500).json({
                success: false,
                error: "Invalid Razorpay Key ID format"
            });
        }

        console.log("Initializing Razorpay with Key ID:", keyId.substring(0, 8) + "***");

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        // Generate unique receipt ID for check payment
        const receiptId = `receipt_check_${checkNumber || Date.now()}`;

        // Convert amount to paisa (smallest currency unit)
        const amountInPaisa = Math.round(amount * 100);

        const options = {
            amount: amountInPaisa,
            currency: "INR",
            receipt: receiptId,
            notes: {
                payment_type: "check",
                ...(checkNumber && { check_number: checkNumber }),
                ...(bankName && { bank_name: bankName }),
            },
        };

        console.log("Creating Razorpay check payment order with options:", {
            amount: options.amount,
            currency: options.currency,
            receipt: options.receipt,
            key_id: keyId ? "***" : "rzp_test_RkgYklrk2WT4fq"
        });

        const order = await razorpay.orders.create(options);

        console.log("Check payment order created successfully:", order.id);

        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Razorpay API Error:", error);
        console.error("Error details:", {
            message: error.message,
            statusCode: error.statusCode,
            error: error.error,
            description: error.error ? .description || error.description
        });

        // Handle specific error types
        const errorDescription = error.error ? .description || error.description || "";

        // Handle amount limit errors
        if (errorDescription.includes("Amount exceeds maximum") || errorDescription.includes("maximum amount")) {
            return res.status(400).json({
                success: false,
                error: "Amount exceeds maximum allowed limit",
                details: errorDescription,
                hint: "For test mode, maximum amount is ₹1,00,000. For higher amounts, use live mode credentials."
            });
        }

        // Handle authentication errors
        if (error.statusCode === 401 || (error.error ? .code === 'BAD_REQUEST_ERROR' && errorDescription.includes("Authentication"))) {
            return res.status(401).json({
                success: false,
                error: "Authentication failed. Please verify your Razorpay credentials.",
                details: errorDescription || "Invalid Key ID or Key Secret",
                hint: "Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local file"
            });
        }

        return res.status(500).json({
            success: false,
            error: error.message || "Failed to create order",
            details: errorDescription,
            statusCode: error.statusCode
        });
    }
}