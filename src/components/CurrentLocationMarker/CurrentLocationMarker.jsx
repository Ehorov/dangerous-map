import { Marker } from '@react-google-maps/api';

export const CurrentLocationMarker = ({ position }) => {
  return <Marker position={position} icon={{ url: '/defender.svg' }} />;
};

// export const Marker = ({ position }) => {
//   return (
//     <GoogleMapMarker position={position} icon={{ url: '/location.svg' }} />
//   );
// };
