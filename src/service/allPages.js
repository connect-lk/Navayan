import requests from "./httpServices";

const AllPages = {
  properties: async () => {
    try {
      return await requests.get("/properties?acf_format=standard");
    } catch (error) {
      console.error(
        "Error fetching properties:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  inventoryList: async (id) => {
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

  holdFlat: async (id) => {
    try {
      const res = await requests.post(`/hold?flat_id=${id}`);
      if (res.status) {
        console.log("Flat held successfully:", res.data);
      } else {
        console.error("Failed to hold flat:", res.data, "Code:", res.code);
      }
    } catch (error) {
      console.error(
        "Error fetching property detail:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // bookFlat: async (id) => {
  //   try {
  //     const res = await requests.post(`/book_flat?flat_id=${id}`);
  //     if (res.status) {
  //       console.log("Flat held successfully:", res.data);
  //     } else {
  //       console.error("Failed to hold flat:", res.data, "Code:", res.code);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error fetching property detail:",
  //       error.response?.data || error.message
  //     );
  //     throw error;
  //   }
  // },
};

export default AllPages;
