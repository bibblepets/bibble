import mongoose, { Model, Schema } from 'mongoose';
import { IHairCoat } from '../interfaces/hair-coat.interface';

export interface IHairCoatModel extends Model<IHairCoat> {}

const HairCoatSchema = new Schema(
  {
    speciesId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
  },
  { collection: 'hair-coats' }
);

const HairCoat = mongoose.model<IHairCoat, IHairCoatModel>(
  'HairCoat',
  HairCoatSchema
);

module.exports = HairCoat;
