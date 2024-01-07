import mongoose, { Model, Schema } from 'mongoose';
import { ILegalTag } from '../interfaces/legal-tag.interface';

export interface ILegalTagModel extends Model<ILegalTag> {}

const LegalTagSchema = new Schema(
  {
    speciesId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: true }
  },
  { collection: 'legal-tags' }
);

const LegalTag = mongoose.model<ILegalTag, ILegalTagModel>(
  'LegalTag',
  LegalTagSchema
);

module.exports = LegalTag;
