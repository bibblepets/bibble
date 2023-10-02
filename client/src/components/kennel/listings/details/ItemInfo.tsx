import {
  CheckBadgeIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  InformationCircleIcon,
  CalendarDaysIcon,
  FingerPrintIcon,
  BriefcaseIcon,
  CheckIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const ItemInfo = () => {
  const date = new Date(Date.now());
  return (
    <>
      <div className="col-span-4 flex flex-col gap-6">
        {/* Listing Information Header */}
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold flex flex-row justify-between gap-2">
            <div className="flex place-items-center">
              <p className="pr-1">Posted by {'INSERT LISTER NAME'}</p>
              {true && <CheckBadgeIcon className="w-6 h-6 text-sky-500" />}
            </div>
            {/* <Avatar src={pet.lister.image} /> */}
          </div>
          <div className="font-light text-neutral-500">
            Listed on{' '}
            {date.toLocaleDateString('en-GB', {
              timeZone: 'SST'
            })}{' '}
            (10 days ago)
          </div>
        </div>

        {/* Basic Information */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-neutral-400">
            <InformationCircleIcon className="w-6 h-6" />
            {' Basic Information'}
            <hr className="grow" />
          </div>

          <div className="flex items-center gap-4 pl-1">
            <UserIcon className="w-4 h-4 text-neutral-700" />
            {String('Male').charAt(0).toUpperCase()}
            {String('Male').slice(1).toLowerCase()}
          </div>

          <div className="flex items-center gap-4 pl-1">
            <FingerPrintIcon className="w-4 h-4 text-neutral-700" />
            {'INSERT PET BREED'}
          </div>

          <div className="flex items-center gap-4 pl-1">
            <CalendarDaysIcon className="w-4 h-6 text-neutral-700" />
            {date.toLocaleDateString('en-GB', { timeZone: 'SST' })} (2 Years
            Old)
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-neutral-400">
            <QuestionMarkCircleIcon className="w-6 h-6" />
            {' Description'}
            <hr className="grow" />
          </div>

          <div className="flex flex-col items-start gap-4">
            {/* <p className="font-semibold text-xl">More about me</p> */}
            <p className="line-clamp-6 tracking-wide leading-relaxed">
              {'Lorem ipsum, INSERT DESCRIPTION'}
            </p>

            <button
              className="font-semibold underline"
              // onClick={handleOpenViewMoreModal}
            >
              Read More...
            </button>
          </div>
        </div>

        {/* Medical Information */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-neutral-400">
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
            {' Medical Information'}
            <hr className="grow" />
          </div>

          <div className="flex items-center gap-4 pl-1">
            {true ? (
              <CheckIcon className="w-4 h-4 text-neutral-700" />
            ) : (
              <XMarkIcon className="w-4 h-4 text-neutral-700" />
            )}
            Vaccinated
          </div>

          {[1, 2, 3].map((id, index) => {
            return (
              <div
                className="ml-8 flex flex-cols gap-2 items-center"
                key={index}
              >
                <ShieldCheckIcon className="w-4 h-4 text-neutral-700" />
                {'INSERT VACCINATION NAME'}
              </div>
            );
          })}

          <div className="flex items-center gap-4 pl-1">
            {true ? (
              <CheckIcon className="w-4 h-4 text-neutral-700" />
            ) : (
              <XMarkIcon className="w-4 h-4 text-neutral-700" />
            )}
            Mircrochipped
          </div>

          <div className="flex items-center gap-4 pl-1">
            {true ? (
              <CheckIcon className="w-4 h-4 text-neutral-700" />
            ) : (
              <XMarkIcon className="w-4 h-4 text-neutral-700" />
            )}
            Neutered
          </div>
        </div>

        {/* Legal Information */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-neutral-400">
            <BriefcaseIcon className="w-6 h-6" />
            {' Legal Information'}
            <hr className="grow" />
          </div>

          <div className="flex items-center gap-4 pl-1">
            {true ? (
              <CheckIcon className="w-4 h-4 text-neutral-700" />
            ) : (
              <XMarkIcon className="w-4 h-4 text-neutral-700" />
            )}
            HDB Approved
          </div>

          <div className="flex items-center gap-4 pl-1">
            {true ? (
              <CheckIcon className="w-4 h-4 text-neutral-700" />
            ) : (
              <XMarkIcon className="w-4 h-4 text-neutral-700" />
            )}
            AVS License {'-INSERT AVS LICENSE NUMBER-'}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemInfo;
