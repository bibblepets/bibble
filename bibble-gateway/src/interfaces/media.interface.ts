export interface IMedia {
  _id?: string;
  name: string;
  url?: string;
}

export interface IMediaResponse extends Omit<IMedia, 'url'> {
  url: string;
}
