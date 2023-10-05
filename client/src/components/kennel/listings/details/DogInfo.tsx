import {
  QuestionMarkCircleIcon,
  UserIcon,
  InformationCircleIcon,
  CalendarDaysIcon,
  FingerPrintIcon,
  BriefcaseIcon,
  CheckIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  ScaleIcon,
  ArrowsPointingOutIcon,
  ScissorsIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import profilePic from '../../../../assets/dog8.jpeg';

const Section = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-8">{children}</div>;
};

const SectionHeader = ({
  title,
  IconComponent
}: {
  title: string;
  IconComponent: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}) => {
  return (
    <div className="flex items-center gap-2 text-neutral-500">
      <IconComponent className="w-6 h-6" />
      {` ${title}`}
      <hr className="grow" />
    </div>
  );
};

const Information = ({
  string,
  IconComponent
}: {
  string: string;
  IconComponent: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}) => {
  return (
    <div className="flex items-center gap-4 pl-1">
      <IconComponent className="w-4 h-4 text-black" />
      {`${string}`}
    </div>
  );
};

const ItemInfo = () => {
  const date = new Date(Date.now());
  return (
    <>
      <div className="col-span-4 flex flex-col gap-12">
        {/* Listing Information Header */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <p className="pr-1 text-xl font-semibold">Posted by {'INSERT LISTER NAME'}</p>
              {true && <CheckBadgeIcon className="w-6 h-6 text-sky-500" />}
            </div>
            <p className="font-light text-neutral-500">
              Listed on {date.toLocaleDateString('en-GB', { timeZone: 'SST' })}{' '}
              {''}
              (10 days ago)
            </p>
          </div>
          <img src={profilePic} className="object-cover w-20 h-20 rounded-full" />
        </div>
        
        {/* Basic Information */}
        <Section>
          <SectionHeader
            title="Basic Information"
            IconComponent={InformationCircleIcon}
          />

          <Information
            string={`${[
              String('Male').charAt(0).toUpperCase(),
              String('Male').slice(1).toLowerCase()
            ].join('')}`}
            IconComponent={UserIcon}
          />

          <Information
            string={`${date.toLocaleDateString('en-GB', {
              timeZone: 'SST'
            })} (2 Years Old)`}
            IconComponent={CalendarDaysIcon}
          />

          <Information
            string={'INSERT ORIGIN COUNTRY'}
            IconComponent={FlagIcon}
          />

          <Information
            string={['INSERT DOG BREED'].join('')}
            IconComponent={FingerPrintIcon}
          />

          <Information string={'INSERT WEIGHT'} IconComponent={ScaleIcon} />

          <Information
            string={'INSERT SIZE'}
            IconComponent={ArrowsPointingOutIcon}
          />

          <Information
            string={'INSERT HAIR COAT'}
            IconComponent={ScissorsIcon}
          />
        </Section>

        {/* Description */}
        <Section>
          <SectionHeader
            title="Description"
            IconComponent={QuestionMarkCircleIcon}
          />

          <div className="flex flex-col items-start gap-4">
            <p className="line-clamp-6 tracking-wide leading-relaxed">
              {'Lorem ipsum, INSERT DESCRIPTION'}
            </p>

            <button className="font-semibold underline">Read More...</button>
          </div>
        </Section>

        {/* Medical Information */}
        <Section>
          <SectionHeader
            title="Medical Information"
            IconComponent={ClipboardDocumentCheckIcon}
          />

          <Information
            string={'Core Vaccines'}
            IconComponent={true ? CheckIcon : XMarkIcon}
          />

          {[
            'Canine Distemper Virus (CDV)',
            'Canine Adenovirus (CAV)',
            'Canine Parvovirus (CPV)'
          ].map((vaccine, index) => {
            return (
              <div
                className="ml-8 flex flex-cols gap-2 items-center"
                key={index}
              >
                <ShieldCheckIcon className="w-4 h-4 text-black" />
                {vaccine}
              </div>
            );
          })}

          <Information
            string={'Non-Core Vaccines'}
            IconComponent={true ? CheckIcon : XMarkIcon}
          />

          {[
            'Leptospirosis',
            'Rabies',
            'Canine Infectious Respiratory Disease Complex (Kennel Cough)',
            'Canine Coronavirus (CCV)'
          ].map((vaccine, index) => {
            return (
              <div
                className="ml-8 flex flex-cols gap-2 items-center"
                key={index}
              >
                <ShieldCheckIcon className="w-4 h-4 text-black" />
                {vaccine}
              </div>
            );
          })}

          <Information
            string={'Neutered'}
            IconComponent={true ? CheckIcon : XMarkIcon}
          />
        </Section>

        {/* Legal Information */}
        <Section>
          <SectionHeader
            title="Legal Information"
            IconComponent={BriefcaseIcon}
          />

          <Information
            string={'HDB Approved'}
            IconComponent={true ? CheckIcon : XMarkIcon}
          />

          <Information
            string={'Mircrochipped'}
            IconComponent={true ? CheckIcon : XMarkIcon}
          />

          <Information
            string={'AVS License -INSERT AVS LICENSE NUMBER'}
            IconComponent={true ? CheckIcon : XMarkIcon}
          />
        </Section>
      </div>
    </>
  );
};

export default ItemInfo;
