export const getMediaUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') 
    : 'http://localhost:5000';
    
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default getMediaUrl;
