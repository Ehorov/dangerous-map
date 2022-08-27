import { Marker as GoogleMapMarker } from '@react-google-maps/api';

export const Marker = ({ position, icon, onClick }) => {
  return <GoogleMapMarker position={position} icon={icon} onClick={onClick} />;
};
