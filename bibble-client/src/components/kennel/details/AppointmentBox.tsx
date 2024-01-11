import React from 'react';
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { Listing } from '../../../features/listing/types';
import { toAddressString } from '../../../utils/string';

interface AppointmentBoxProps {
  listing: Listing;
}

const AppointmentBox: React.FC<AppointmentBoxProps> = ({ listing }) => {
  return (
    <div className="sticky flex flex-col gap-4 p-8 top-64 rounded-lg shadow-lg border">
      <p className="px-8 mb-2 text-center">Contact {listing.user?.firstName}</p>
      <hr />
      <div className="flex flex-col gap-4 h-full mt-2 font-light text-sm">
        <div className="flex items-center">
          <MapPinIcon className="inline-block w-4 h-4 mr-2" />
          <p className="w-full overflow-auto whitespace-pre-line">
            {toAddressString(listing.user?.address)}
          </p>
        </div>
        <div className="flex items-center">
          <EnvelopeIcon className="inline-block w-4 h-4 mr-2" />
          <p className="w-full overflow-auto break-words">
            {listing.user?.email}
          </p>
        </div>
        <div className="flex items-center">
          <PhoneIcon className="inline-block w-4 h-4 mr-2" />
          <p className="w-full overflow-auto break-words">
            {listing.user?.contactNumber}
          </p>
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
