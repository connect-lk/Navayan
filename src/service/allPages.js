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
  console.log("id", id);
  try {
    if (!id) throw new Error("Property ID is missing"); 
    return await requests.get(`/sp_property_availability?property_id=${id}`);
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
