import {
  ChevronRightIcon,
  DocumentDuplicateIcon,
  PaperClipIcon,
  SquaresPlusIcon
} from '@heroicons/react/24/outline';
import ListingLayout from '../../layouts/ListingLayout';

const Listing = () => {
  return (
    <>
      <ListingLayout>
        <div className="flex justify-center items-center pb-20">
          <div className="flex flex-col gap-8 w-[780px]">
            <h1 className="text-3xl font-medium">Welcome back, Titus</h1>
            <h2 className="text-xl font-medium">Finish your listing</h2>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-4 p-4 border rounded-xl w-full cursor-pointer transition hover:opacity-75">
                <PaperClipIcon className="w-6 h-6" />
                Golden Retriever
              </div>
              <div className="flex flex-row gap-4 p-4 border rounded-xl w-full cursor-pointer transition hover:opacity-75">
                <PaperClipIcon className="w-6 h-6" />
                Siberian Husky
              </div>
              <div className="flex flex-row gap-4 p-4 border rounded-xl w-full cursor-pointer transition hover:opacity-75">
                <PaperClipIcon className="w-6 h-6" />
                Pomerenian
              </div>
            </div>

            <h2 className="text-xl font-medium pt-8">Start a new listing</h2>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center p-4 border-b w-full cursor-pointer transition hover:opacity-75">
                <div className="flex flex-row gap-4">
                  <SquaresPlusIcon className="w-6 h-6" />
                  Create a new listing
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-row justify-between items-center p-4 border-b w-full cursor-pointer transition hover:opacity-75">
                <div className="flex flex-row gap-4">
                  <DocumentDuplicateIcon className="w-6 h-6" />
                  Duplicate an existing listing
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </ListingLayout>
    </>
  );
};

export default Listing;
