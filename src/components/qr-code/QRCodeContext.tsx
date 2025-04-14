
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define QR code data structure
interface QRCodeData {
  text: string;
  vcardName: string;
  vcardEmail: string;
  vcardPhone: string;
  vcardCompany: string;
  vcardTitle: string;
  vcardWebsite: string;
  vcardAddress: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: string;
  wifiHidden: boolean;
  eventTitle: string;
  eventLocation: string;
  eventStart: string;
  eventEnd: string;
  eventDescription: string;
  latitude: string;
  longitude: string;
}

// Define QR code settings structure
interface QRCodeSettings {
  size: number;
  qrColor: string;
  bgColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  frameStyle: string;
  cornerStyle: string;
}

// Define validation error structure
interface ValidationError {
  field: string;
  message: string;
}

// Define the context type
interface QRCodeContextType {
  data: QRCodeData;
  settings: QRCodeSettings;
  qrDataUrl: string;
  activeTab: string;
  validationErrors: ValidationError[];
  updateData: (newData: Partial<QRCodeData>) => void;
  updateSettings: (newSettings: Partial<QRCodeSettings>) => void;
  setQrDataUrl: (url: string) => void;
  generateQRCode: () => void;
  setActiveTab: (tab: string) => void;
  getQrContent: () => string;
  validate: () => boolean;
}

// Create the context
const QRCodeContext = createContext<QRCodeContextType | undefined>(undefined);

// QR code provider component
export const QRCodeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial QR code data
  const [data, setData] = useState<QRCodeData>({
    text: '',
    vcardName: '',
    vcardEmail: '',
    vcardPhone: '',
    vcardCompany: '',
    vcardTitle: '',
    vcardWebsite: '',
    vcardAddress: '',
    wifiSsid: '',
    wifiPassword: '',
    wifiEncryption: 'WPA',
    wifiHidden: false,
    eventTitle: '',
    eventLocation: '',
    eventStart: '',
    eventEnd: '',
    eventDescription: '',
    latitude: '',
    longitude: ''
  });

  // Initial QR code settings
  const [settings, setSettings] = useState<QRCodeSettings>({
    size: 200,
    qrColor: '#000000',
    bgColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
    frameStyle: 'none',
    cornerStyle: 'square'
  });

  // QR code image data URL
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  
  // Active tab
  const [activeTab, setActiveTab] = useState<string>('text');
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Validate QR code data based on active tab
  const validate = (): boolean => {
    const errors: ValidationError[] = [];
    
    if (activeTab === 'text') {
      if (!data.text.trim()) {
        errors.push({ field: 'text', message: 'Text content is required' });
      } else if (data.text.length > 500) {
        errors.push({ field: 'text', message: 'Text must be less than 500 characters' });
      }
      
      // If it looks like a URL, check for proper formatting
      if (data.text.includes('http') && !data.text.match(/^https?:\/\/.+\..+/)) {
        errors.push({ field: 'text', message: 'URL format should be: http(s)://domain.tld' });
      }
    } else if (activeTab === 'vcard') {
      if (!data.vcardName.trim()) {
        errors.push({ field: 'vcardName', message: 'Name is required' });
      }
      
      if (data.vcardEmail && !data.vcardEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push({ field: 'vcardEmail', message: 'Invalid email format' });
      }
      
      if (data.vcardPhone && !data.vcardPhone.match(/^[+]?[\d\s()-]+$/)) {
        errors.push({ field: 'vcardPhone', message: 'Invalid phone format' });
      }
      
      if (data.vcardWebsite && !data.vcardWebsite.match(/^https?:\/\/.+\..+/)) {
        errors.push({ field: 'vcardWebsite', message: 'URL format should be: http(s)://domain.tld' });
      }
    } else if (activeTab === 'wifi') {
      if (!data.wifiSsid.trim()) {
        errors.push({ field: 'wifiSsid', message: 'Network name is required' });
      }
      
      if (data.wifiEncryption !== 'nopass' && !data.wifiPassword.trim()) {
        errors.push({ field: 'wifiPassword', message: 'Password is required for encrypted networks' });
      }
    } else if (activeTab === 'event') {
      if (!data.eventTitle.trim()) {
        errors.push({ field: 'eventTitle', message: 'Event title is required' });
      }
      
      if (!data.eventStart) {
        errors.push({ field: 'eventStart', message: 'Start date is required' });
      }
      
      if (data.eventEnd && new Date(data.eventEnd) < new Date(data.eventStart)) {
        errors.push({ field: 'eventEnd', message: 'End date must be after start date' });
      }
    } else if (activeTab === 'location') {
      if (!data.latitude.trim() || !data.longitude.trim()) {
        errors.push({ field: 'latitude', message: 'Both latitude and longitude are required' });
      } else {
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        
        if (isNaN(lat) || lat < -90 || lat > 90) {
          errors.push({ field: 'latitude', message: 'Latitude must be between -90 and 90' });
        }
        
        if (isNaN(lon) || lon < -180 || lon > 180) {
          errors.push({ field: 'longitude', message: 'Longitude must be between -180 and 180' });
        }
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Get QR code content based on active tab
  const getQrContent = (): string => {
    switch (activeTab) {
      case 'text':
        return data.text;
      case 'vcard':
        return formatVCard();
      case 'wifi':
        return formatWifi();
      case 'event':
        return formatEvent();
      case 'location':
        return formatLocation();
      default:
        return data.text;
    }
  };

  // Format vCard data
  const formatVCard = (): string => {
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
    
    if (data.vcardName) vcard += `FN:${data.vcardName}\n`;
    if (data.vcardName) vcard += `N:${data.vcardName.includes(' ') ? data.vcardName.split(' ').reverse().join(';') : data.vcardName};;;\n`;
    if (data.vcardCompany) vcard += `ORG:${data.vcardCompany}\n`;
    if (data.vcardTitle) vcard += `TITLE:${data.vcardTitle}\n`;
    if (data.vcardPhone) vcard += `TEL:${data.vcardPhone}\n`;
    if (data.vcardEmail) vcard += `EMAIL:${data.vcardEmail}\n`;
    if (data.vcardWebsite) vcard += `URL:${data.vcardWebsite}\n`;
    if (data.vcardAddress) vcard += `ADR:;;${data.vcardAddress};;;\n`;
    
    vcard += 'END:VCARD';
    return vcard;
  };

  // Format WiFi data
  const formatWifi = (): string => {
    let wifi = 'WIFI:';
    
    if (data.wifiEncryption) wifi += `T:${data.wifiEncryption};`;
    if (data.wifiSsid) wifi += `S:${data.wifiSsid};`;
    if (data.wifiPassword && data.wifiEncryption !== 'nopass') wifi += `P:${data.wifiPassword};`;
    if (data.wifiHidden) wifi += 'H:true;';
    
    return wifi + ';';
  };

  // Format event data
  const formatEvent = (): string => {
    let event = 'BEGIN:VEVENT\n';
    
    if (data.eventTitle) event += `SUMMARY:${data.eventTitle}\n`;
    if (data.eventLocation) event += `LOCATION:${data.eventLocation}\n`;
    if (data.eventDescription) event += `DESCRIPTION:${data.eventDescription}\n`;
    
    if (data.eventStart) {
      const startDate = new Date(data.eventStart);
      event += `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}\n`;
    }
    
    if (data.eventEnd) {
      const endDate = new Date(data.eventEnd);
      event += `DTEND:${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}\n`;
    }
    
    event += 'END:VEVENT';
    return event;
  };

  // Format location data
  const formatLocation = (): string => {
    return `geo:${data.latitude},${data.longitude}`;
  };

  // Update QR code data
  const updateData = (newData: Partial<QRCodeData>) => {
    setData({ ...data, ...newData });
  };

  // Update QR code settings
  const updateSettings = (newSettings: Partial<QRCodeSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  // Generate QR code
  const generateQRCode = () => {
    if (validate()) {
      // The actual QR code generation happens in QRCodeDisplay component
      const content = getQrContent();
      if (content) {
        setValidationErrors([]);
      }
    }
  };

  // First-time generation on tab change
  useEffect(() => {
    if (activeTab === 'text' && data.text) {
      generateQRCode();
    } else if (activeTab === 'vcard' && data.vcardName) {
      generateQRCode();
    } else if (activeTab === 'wifi' && data.wifiSsid) {
      generateQRCode();
    } else if (activeTab === 'event' && data.eventTitle) {
      generateQRCode();
    } else if (activeTab === 'location' && data.latitude && data.longitude) {
      generateQRCode();
    }
  }, [activeTab]);

  // Export context value
  const contextValue: QRCodeContextType = {
    data,
    settings,
    qrDataUrl,
    activeTab,
    validationErrors,
    updateData,
    updateSettings,
    setQrDataUrl,
    generateQRCode,
    setActiveTab,
    getQrContent,
    validate
  };

  return (
    <QRCodeContext.Provider value={contextValue}>
      {children}
    </QRCodeContext.Provider>
  );
};

// Custom hook to use QR code context
export const useQRCode = () => {
  const context = useContext(QRCodeContext);
  if (!context) {
    throw new Error('useQRCode must be used within a QRCodeContextProvider');
  }
  return context;
};
