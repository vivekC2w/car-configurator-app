import axios from "axios";

const API_BASE_URL = "http://localhost:5002/api";
 
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Cache for model data
const modelCache = {};

//Models API
export const fetchModels = async () => {
    if (modelCache.all) return modelCache.all;

    try {
      const response = await api.get('/models');
      modelCache.all = {
        success: response.data.success,
        data: response.data.data, 
        count: response.data.count
      };
      return modelCache.all;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch models');
    }
  };
  
  export const fetchModelByName = async (name) => {
    const cacheKey = `model-${name}`;
    if (modelCache[cacheKey]) return modelCache[cacheKey];
    
    try {
      const encodedName = encodeURIComponent(name); 
      const response = await api.get(`/models/name/${encodedName}`);
      modelCache[cacheKey] = response.data;
      return modelCache[cacheKey];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch model');
    }
};
  
  export const fetchVariantsByModel = async (modelId) => {
    const cacheKey = `variants-${modelId}`;
    if (modelCache[cacheKey]) return modelCache[cacheKey];

    try {
      const response = await api.get(`/models/${modelId}/variants`);
      modelCache[cacheKey] = response.data;
      return modelCache[cacheKey];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch variants');
    }
  };

  export const fetchColorsByVariant = async (variantId) => {
    const cacheKey = `colors-${variantId}`;
    if (modelCache[cacheKey]) return modelCache[cacheKey];

    try {
      const response = await api.get(`/colors/${variantId}/colors`);
      modelCache[cacheKey] = response.data;
      return modelCache[cacheKey];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch colors');
    }
  };

  export const fetchAccessoriesByVariantId = async (variantId) => {
    const cacheKey = `accessories-${variantId}`;
    if (modelCache[cacheKey]) return modelCache[cacheKey];
    try {
      const response = await api.get(`/accessories/variant/${variantId}`);
      modelCache[cacheKey] = response.data;
      return modelCache[cacheKey];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch accessories');
    }
  };

  export const fetchFeaturesByVariantId = async (variantId) => {
    const cacheKey = `features-${variantId}`;
    if (modelCache[cacheKey]) return modelCache[cacheKey];
    try {
      const response = await api.get(`/features/${variantId}/features`);
      modelCache[cacheKey] = response.data;
      return modelCache[cacheKey];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch features');
    }
  } 

export default api;