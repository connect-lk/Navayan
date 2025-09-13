import axios from "axios";

export default async function handler(req, res) {
  const { endpoint, property_id } = req.query;
    console.log("property_id",property_id)
  try {
    // Build the URL dynamically
    const url = property_id
      ? `https://book.neotericproperties.in/wp-json/properties/v2/${endpoint}?property_id=${property_id}`
      : `https://book.neotericproperties.in/wp-json/properties/v2/${endpoint}`;

    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
