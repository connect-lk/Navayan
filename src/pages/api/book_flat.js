export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = req.body; 
      const newKYC = {
        id: Date.now(),
        ...body,
      };

      return res.status(200).json({
        success: true,
        message: "KYC details saved successfully",
        data: newKYC,
      });
    } catch (error) {
      console.error("Error saving KYC:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
