import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getProducts() {
    return apiClient.get('/products');
  },
  getProduct(id) {
    return apiClient.get(`/products/${id}`);
  },
  createProduct(product) {
    return apiClient.post('/products', product);
  },
  updateProduct(id, product) {
    return apiClient.put(`/products/${id}`, product);
  },
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },
};
