import React from 'react';
import { Listing } from '../../../types';
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface AppointmentBoxProps {
  listing: Listing;
}

const AppointmentBox: React.FC<AppointmentBoxProps> = ({ listing }) => {
  return (
    <div className="sticky flex flex-col gap-4 p-8 top-64 rounded-lg shadow-lg border">
      <p className="px-8 mb-2 text-center">
        Contact {listing.lister.businessProfile?.businessName}
      </p>
      <hr />
      <div className="flex flex-col gap-4 h-full mt-2 font-light text-sm">
        <div className="flex items-center">
          <MapPinIcon className="inline-block w-4 h-4 mr-2" />
          <p>TODO: Location Data</p>
        </div>
        <div className="flex items-center">
          <EnvelopeIcon className="inline-block w-4 h-4 mr-2" />
          <p>{listing.lister.businessProfile?.businessEmail}</p>
        </div>
        <div className="flex items-center">
          <PhoneIcon className="inline-block w-4 h-4 mr-2" />
          <p>{listing.lister.businessProfile?.businessContact}</p>
        </div>
        <div className="flex justify-between font-semibold">
          <p>Listed at </p>
          <p>${listing.price} SGD</p>
        </div>
      </div>
      <hr />
      <button className="p-2 mt-2 rounded-lg bg-gradient-to-r hover:bg-gradient-to-l from-sky-500 to-sky-600 text-white">
        <p>Message</p>
      </button>
      <button className="p-2 rounded-lg bg-gradient-to-r hover:bg-gradient-to-l from-sky-500 to-sky-600 text-white">
        <p>Book a visit</p>
      </button>
    </div>
  );
};

export default AppointmentBox;
