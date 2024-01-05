import {
  ArrowsPointingOutIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  FingerPrintIcon,
  GlobeAsiaAustraliaIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { BiFemaleSign, BiMaleSign } from 'react-icons/bi';
import paw from '/images/paw.jpeg';
import { Listing } from '../../../types';
import InfoSection from './InfoSection';
import SectionHeader from './SectionHeader';
import { DateStringOptions, toAge, toListingAge } from '../../../utils/date';
import { openViewMoreModal } from '../../../features/modalsSlice';
import { store } from '../../../store';

const Section = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-8">{children}</div>;
};

interface ItemInfoProps {
  listing: Listing;
}

const ItemInfo: React.FC<ItemInfoProps> = ({ listing }) => {
  const listingDate = new Date(listing.createdAt!);
  const birthDate = new Date(listing.animal.birthdate!);
  const currentDate = new Date();

  const handleOpenViewMoreModal = () => {
    store.dispatch(openViewMoreModal(listing.description));
  };

  return (
    <div className="col-span-4 flex flex-col gap-12">
      {/* Listing Info Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <p className="pr-1 text-xl font-medium">
              Posted by{' '}
              {listing.lister.businessProfile?.businessName ||
                listing.lister.buyerProfile?.firstName}
            </p>
            {listing.lister.businessProfile &&
              listing.lister.businessProfile.bibbleTier !== 'Basic' && (
                <CheckBadgeIcon className="w-5 h-5 text-sky-500" />
              )}
          </div>
          <p className="font-light text-neutral-500 text-sm">
            Listed on{' '}
            {listingDate.toLocaleDateString(undefined, DateStringOptions)} {''}(
            {toListingAge(listingDate)})
          </p>
        </div>
        <img
          src={
            listing.lister.businessProfile?.businessPic ||
            listing.lister.buyerProfile?.profilePic?.url ||
            paw
          }
          className="object-cover w-12 h-12 rounded-full"
        />
      </div>

      {/* Basic Info */}
      <Section>
        <SectionHeader
          title="Basic Info"
          IconComponent={InformationCircleIcon}
        />

        <InfoSection
          string={listing.animal.gender}
          IconComponent={
            listing.animal.gender === 'Male' ? BiMaleSign : BiFemaleSign
          }
        />

        <InfoSection
          string={`${birthDate.toLocaleDateString(
            undefined,
            DateStringOptions
          )} (${toAge(birthDate)})`}
          IconComponent={CalendarDaysIcon}
        />

        <InfoSection
          string={listing.animal.origin.name}
          IconComponent={GlobeAsiaAustraliaIcon}
        />

        <InfoSection
          string={listing.animal.breeds.map((b) => b.name).join(', ')}
          IconComponent={FingerPrintIcon}
        />

        <InfoSection
          string={listing.animal.weight.toString() + ' kg'}
          IconComponent={ScaleIcon}
        />

        <InfoSection
          string={listing.animal.size}
          IconComponent={ArrowsPointingOutIcon}
        />

        <InfoSection
          string={listing.animal.hairCoat + ' Coat'}
          IconComponent={ScissorsIcon}
        />
      </Section>

      {/* Description */}
      <Section>
        <SectionHeader
          title="Description"
          IconComponent={QuestionMarkCircleIcon}
        />

        <div className="flex flex-col items-start gap-4 text-gray-800 font-light">
          <p className="line-clamp-6 tracking-wide leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>

          <button
            onClick={handleOpenViewMoreModal}
            className="font-medium text-sm underline"
          >
            Read More...
          </button>
        </div>
      </Section>

      {/* Medical */}
      <Section>
        <SectionHeader
          title="Medical"
          IconComponent={ClipboardDocumentCheckIcon}
        />

        <InfoSection
          string={'Core Vaccines'}
          IconComponent={true ? CheckIcon : XMarkIcon}
        />

        {listing.animal.vaccines.map((vaccine, index) => {
          return (
            vaccine.isCore && (
              <div
                className="ml-8 flex flex-cols gap-2 items-center"
                key={index}
              >
                <ShieldCheckIcon className="w-4 h-4 text-black" />
                {vaccine.name}
              </div>
            )
          );
        })}

        <InfoSection
          string={'Non-Core Vaccines'}
          IconComponent={true ? CheckIcon : XMarkIcon}
        />

        {listing.animal.vaccines.map((vaccine, index) => {
          return (
            !vaccine.isCore && (
              <div
                className="ml-8 flex flex-cols gap-2 items-center"
                key={index}
              >
                <ShieldCheckIcon className="w-4 h-4 text-black" />
                {vaccine.name}
              </div>
            )
          );
        })}

        <InfoSection
          string={'Neutered'}
          IconComponent={listing.animal.isNeutered ? CheckIcon : XMarkIcon}
        />
      </Section>

      {/* Legal InfoSection */}
      <Section>
        <SectionHeader title="Legal" IconComponent={BriefcaseIcon} />

        <InfoSection
          string={'HDB Approved'}
          IconComponent={listing.animal.isHdbApproved ? CheckIcon : XMarkIcon}
        />

        <InfoSection
          string={'Mircrochipped'}
          IconComponent={listing.animal.isMicrochipped ? CheckIcon : XMarkIcon}
        />

        <InfoSection
          string={'AVS License: ' + listing.animal.avsLicenseNumber}
          IconComponent={
            listing.animal.avsLicenseNumber ? CheckIcon : XMarkIcon
          }
        />
      </Section>
    </div>
  );
};

export default ItemInfo;
