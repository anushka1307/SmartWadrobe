const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collection_name: { type: String, required: true },
  clothing_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothingAll' }]
}); 

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
