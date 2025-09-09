import requests from "./httpServices";

const AllPages = {
  dynemic: async (id) => {
    try {
      return await requests.get(`/pages/${id}?acf_format=standard`);
    } catch (error) {
      console.error("Error fetching dynamic page:", error.response?.data || error.message);
      throw error;
    }
  }, 
  properties: async () => {
    try { 
      return await requests.get("/property?acf_format=standard&per_page=100");
    } catch (error) {
      console.error("Error fetching properties:", error.response?.data || error.message);
      throw error;
    }
  },

  propertyDetail: async (slug) => {
    try {
      return await requests.get(`/property?slug=${slug}`);
    } catch (error) {
      console.error("Error fetching property detail:", error.response?.data || error.message);
      throw error;
    }
  },

  carrierSlug: async (slug) => {
    try {
      return await requests.get(`/pages?slug=${slug}`);
    } catch (error) {
      console.error("Error fetching carrier slug:", error.response?.data || error.message);
      throw error;
    }
  }, 
};

export default AllPages;
 