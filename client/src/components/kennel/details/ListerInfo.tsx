import { UserCircleIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import paw from '../../../assets/paw.jpeg';
import { Listing } from '../../../types';
import MapCard from './MapCard';

interface ListerInfoProps {
  listing: Listing;
}

const ListerInfo: React.FC<ListerInfoProps> = ({ listing }) => {
  const joinedAt = new Date(listing.lister.createdAt!);

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
                src={
                  listing.lister.businessProfile?.businessPic ||
                  listing.lister.buyerProfile?.profilePic ||
                  paw
                }
                className="object-cover w-20 h-20 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-2xl font-semibold">
                  {listing.lister.businessProfile?.businessName ||
                    (listing.lister.buyerProfile?.firstName || '') +
                      ' ' +
                      (listing.lister.buyerProfile?.lastName || '')}
                </p>
                {listing.lister.businessProfile &&
                  listing.lister.businessProfile.bibbleTier !== 'Basic' && (
                    <CheckBadgeIcon className="w-6 h-6 text-sky-500" />
                  )}
              </div>

              <p className="text-sm font-light text-gray-500">
                Joined in {joinedAt.toDateString()}
              </p>
            </div>
          </div>

          {/* Lister Description */}
          <div className="mx-4">
            <p className="text-sm font-light text-gra-800">
              {listing.lister.businessProfile?.businessBio ||
                listing.lister.buyerProfile?.bio ||
                `${listing.lister.buyerProfile?.firstName} has not said anything about themselves yet...`}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <MapCard location={'10 Heng Mui Keng Terrace'} />
      </div>
    </>
  );
};

export default ListerInfo;
