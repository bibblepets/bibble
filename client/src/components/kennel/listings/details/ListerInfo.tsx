import { UserCircleIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import MapCard from "./MapCard";
import profilePic from "../../../../assets/dog8.jpeg";

const ListerInfo = () => {
  const getDateJoined = () => {
		let dateJoined = new Date(Date.now());
		let monthsDict = {
			'Jan': 1,
			'Feb': 2,
			'Mar': 3,
			'Apr': 4,
			'May': 5,
			'Jun': 6,
			'Jul': 7,
			'Aug': 8,
			'Sep': 9,
			'Oct': 10,
			'Nov': 11,
			'Dec': 12
			};
		let month = 'MONTH';
		Object.entries(monthsDict).forEach((entry) => {
			let monthName = entry[0];
			let monthIndex = entry[1];
			if (dateJoined.getMonth() == monthIndex) {
				month = monthName;
			}
		});

		return `${month} ${dateJoined.getFullYear()}`
	};

  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-1">
        <UserCircleIcon className="w-6 h-6 text-neutral-500" />{' '}
        <hr className="grow" />
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Lister Banner */}
          <div className="flex flex-rows items-center gap-4">
            <div className="ml-1 aspect-square">
              <img src={profilePic} className="object-cover w-24 h-24 rounded-full" />
            </div>
            <div className="grid grid-rows-2 gap-0">
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold">
                  {'INSERT LISTER NAME'}
                </p>
                {true && (
                  <CheckBadgeIcon className="w-6 h-6 text-sky-500" />
                )}
              </div>

              <p>Joined in {getDateJoined()}</p>
            </div>
          </div>

          {/* Lister Description */}
          <div className="ml-1">
            <p>{'Lorem ipsum, INSERT PROFILE BIO'}</p>
          </div>

          <div className="w-1/3 self-center">
            <button className="py-4 w-full border rounded-full  ">
              Contact Lister
            </button>
          </div>
        </div>

        {/* Right Column */}
        <MapCard location={'10 Heng Mui Keng Terrace'} />
      </div>
    </>
  );
};

export default ListerInfo;
