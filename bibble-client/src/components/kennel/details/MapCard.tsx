import { ArrowPathIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { useEffect, useMemo, useState } from 'react';
import { GeocodeResponse } from '../../../features/types';

// NEED TO HIDE THIS KEY
const GOOGLE_MAPS_API_KEY = 'AIzaSyB7fMl7N6wsGHbbw5duRQUMPzY3lwGYRHE';

interface MapCardProps {
  location?: string;
}

const MapCard: React.FC<MapCardProps> = ({ location }) => {
  const [data, setData] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  useEffect(() => {
    const getCoordinates = async () => {
      if (!location) return null;
      let request_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${GOOGLE_MAPS_API_KEY}`;
      const data = await fetch(request_url).then(async (response) => {
        return await response
          .json()
          .then((data: GeocodeResponse) => {
            return {
              address: data.results[0].formatted_address,
              coordinates: {
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng
              }
            };
          })
          .catch((error) => {
            // Handle
          });
      });
      return data;
    };

    getCoordinates().then((data) => {
      setData(data || null);
    });
  }, [location]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const center = useMemo(() => data?.coordinates, [data?.coordinates]);

  return data && isLoaded ? (
    <div className="h-96 w-full bg-neutral-200 shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex flex-rows m-4 justify-between items-center">
        <MapPinIcon className="w-4 h-4fill-neutral-500" />
        <p className="text-neutral-500">
          {data ? data.address : 'NO ADDRESS FOUND'}
        </p>
      </div>

      {/* Map */}
      <div className="h-3/4 content-center">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={center}
          zoom={16}
        >
          <MarkerF
            position={data.coordinates}
            animation={google.maps.Animation.DROP}
            opacity={1}
            title="We're over here!"
          />
        </GoogleMap>
      </div>
    </div>
  ) : (
    <div className="flex h-96 bg-neutral-200 shadow-xl rounded-2xl items-center">
      <ArrowPathIcon className="w-6 h-6 basis-full text-sky-500 animate-spin" />
    </div>
  );
};

export default MapCard;
