import requests from "./httpServices";
let propertiesCache = null;

const AllPages = {
    properties: async(force = false) => {
        if (propertiesCache && !force) {
            return propertiesCache;
        }
        try {
            const timestamp = new Date().getTime();
            const response = await requests.get(
                `/properties?acf_format=standard&t=${timestamp}`
            );
            propertiesCache = response;
            return response;
        } catch (error) {
            console.error("Error fetching properties:", error);
            throw error;
        }
    },

    inventoryList: async(id) => {
        try {
            const timestamp = new Date().getTime(); // cache-busting
            return await requests.get(
                `/sp_property_availability?property_id=${id}&t=${timestamp}`
            );
        } catch (error) {
            console.error(
                "Error fetching property detail:",
                error.response?.data || error.message
            );
            throw error;
        }
    },

    holdFlat: async(id) => {
        try {
            const res = await requests.post(`/hold?property_id=41&plot_no=${id}`);
            if (res.status) {
                console.log("Flat held successfully:", res.data);
            } else {
                console.error("Failed to hold flat:", res.data, "Code:", res.code);
            }
            return res; // ✅ always return data
        } catch (error) {
            console.error(
                "Error fetching property detail:",
                error.response?.data || error.message
            );
            throw error;
        }
    },

    reviewApplication: async(property_id, plot_no) => {
        try {
            const timestamp = new Date().getTime(); // cache-busting
            return await requests.get(
                `/review_application?property_id=${property_id}&plot_no=${plot_no}&t=${timestamp}`
            );
        } catch (error) {
            console.error(
                "Error fetching property detail:",
                error.response?.data || error.message
            );
            throw error;
        }
    },
  bookedStatusUpdate: async(property_id, plot_no, bookingId, transactionId, payment_status, pdf_quotation_url = null) => {
    try {
      const timestamp = new Date().getTime(); // cache-busting
      let url = `/final_payment?property_id=${property_id}&plot_no=${plot_no}&bookingId=${bookingId}&transactionId=${transactionId}&paymentStatus=${payment_status}&t=${timestamp}`;
      
      // Add PDF URL if provided
      if (pdf_quotation_url) {
        url += `&pdf_quotation_url=${encodeURIComponent(pdf_quotation_url)}`;
      }
      
      return await requests.post(url);
    } catch (error) {
      console.error(
        "Error updating booked status:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
    holdStatusUpdate: async(property_id, plot_no) => {
        try {
            const timestamp = new Date().getTime(); // cache-busting
            return await requests.post(
                `/update_property_status?property_id=${property_id}&plot_no=${plot_no}&t=${timestamp}`
            );
        } catch (error) {
            console.error(
                "Error fetching property detail:",
                error.response?.data || error.message
            );
            throw error;
        }
    },
};

export default AllPages;