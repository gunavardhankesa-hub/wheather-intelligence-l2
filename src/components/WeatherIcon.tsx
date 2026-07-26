import React from 'react';
import {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudHail,
  CloudLightning,
  Snowflake,
  Wind,
  Umbrella,
  Zap,
  Droplets,
  Shirt,
  Footprints,
  Home,
  SunMedium,
  Compass,
  Gauge,
  Sunrise,
  Sunset,
  Eye,
  Thermometer,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  const iconProps = { className, size };

  switch (name) {
    case 'Sun':
      return <Sun {...iconProps} />;
    case 'SunDim':
      return <SunDim {...iconProps} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} />;
    case 'Cloud':
      return <Cloud {...iconProps} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} />;
    case 'CloudRainWind':
      return <CloudRainWind {...iconProps} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} />;
    case 'CloudHail':
      return <CloudHail {...iconProps} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} />;
    case 'Wind':
      return <Wind {...iconProps} />;
    case 'Umbrella':
      return <Umbrella {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'Droplets':
      return <Droplets {...iconProps} />;
    case 'Shirt':
      return <Shirt {...iconProps} />;
    case 'Footprints':
      return <Footprints {...iconProps} />;
    case 'Home':
      return <Home {...iconProps} />;
    case 'SunMedium':
      return <SunMedium {...iconProps} />;
    case 'Compass':
      return <Compass {...iconProps} />;
    case 'Gauge':
      return <Gauge {...iconProps} />;
    case 'Sunrise':
      return <Sunrise {...iconProps} />;
    case 'Sunset':
      return <Sunset {...iconProps} />;
    case 'Eye':
      return <Eye {...iconProps} />;
    case 'Thermometer':
      return <Thermometer {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
};
