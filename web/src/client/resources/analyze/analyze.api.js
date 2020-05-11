import { apiClient } from 'services/api';

export const analyzeData = ({
  text,
  image,
}) => {
  const formData = new FormData();

  formData.append('text', text);
  formData.append('image', image);

  return apiClient.post('/processing/analyze', formData);
};
