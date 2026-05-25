import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  address: { type: String, default: '' },
  wheelchairaccessibility: { type: String, default: '' },
  days: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  website: { type: String, default: '' },
  imgSrc: { type: String, default: '' },
  imgAlt: { type: String, default: '' },
  discipline: { type: String, default: '' }
});

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;
