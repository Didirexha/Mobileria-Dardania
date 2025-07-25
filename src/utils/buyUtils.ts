export interface Product {
  _id?: string;
  title: string;
  subtitle: string;
  description?: string;
  images?: string[];
  image?: string;
  category?: string;
  features?: string[];
  specifications?: {
    [key: string]: string;
  };
}

export const handleBuyProduct = (product: Product) => {
  const phoneNumber = '+38349514788';
  
  // Create product information message
  let message = `🛒 *Product Inquiry*\n\n`;
  message += `*Product:* ${product.title}\n`;
  
  if (product.category) {
    message += `*Category:* ${product.category}\n`;
  }
  
  if (product.subtitle) {
    message += `*Subtitle:* ${product.subtitle}\n`;
  }
  
  if (product.description) {
    message += `*Description:* ${product.description}\n`;
  }
  
  if (product.features && product.features.length > 0) {
    message += `*Features:*\n${product.features.map(feature => `• ${feature}`).join('\n')}\n`;
  }
  
  if (product.specifications && Object.keys(product.specifications).length > 0) {
    message += `*Specifications:*\n`;
    Object.entries(product.specifications).forEach(([key, value]) => {
      message += `• ${key}: ${value}\n`;
    });
  }
  
  message += `\nI'm interested in purchasing this product. Please provide more information about pricing and availability.`;
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');
}; 