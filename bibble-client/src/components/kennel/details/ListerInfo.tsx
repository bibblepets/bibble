import { UserCircleIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import paw from '/images/paw.jpeg';
import MapCard from './MapCard';
import { Listing } from '../../../features/listing/types';
import { toAddressString } from '../../../utils/string';

interface ListerInfoProps {
  listing: Listing;
}

const ListerInfo: React.FC<ListerInfoProps> = ({ listing }) => {
  const joinedAt = listing.user?.createdAt && new Date(listing.user.createdAt);

  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-1">
        <UserCircleIcon className="w-6 h-6 text-gray-800" />{' '}
        <hr className="mx-4 grow" />
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}

        <div className="flex flex-col gap-6">
          {/* Lister Banner */}
          <div className="flex flex-row items-center gap-4">
            <div className="ml-1 aspect-square">
              <img
                src={listing.user?.profilePic?.url || paw}
                className="object-cover w-20 h-20 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-2xl font-semibold">
                  {listing.user?.firstName + ' ' + listing.user?.lastName}
                </p>
                {/* {listing.lister.businessProfile &&
                  listing.lister.businessProfile.bibbleTier !== 'Basic' && (
                    <CheckBadgeIcon className="w-6 h-6 text-sky-500" />
                  )} */}
              </div>

              {joinedAt && (
                <p className="text-sm font-light text-gray-500">
                  Joined in {joinedAt.toDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Lister Description */}
          <div className="mx-4">
            <p className="text-sm font-light text-gra-800">
              {listing.user?.bio ||
                `${listing.user?.firstName} has not said anything about themselves yet...`}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <MapCard location={toAddressString(listing.user?.address)} />
      </div>
    </>
  );
};

export default ListerInfo;
