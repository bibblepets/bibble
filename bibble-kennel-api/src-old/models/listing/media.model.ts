import { Schema } from "mongoose";

export interface IMedia {
    _id: Schema.Types.ObjectId;
    name: string;
    url?: string
  }
  
  export interface IPopulatedMedia extends Omit<IMedia, 'url'> {
    url: string;
  }