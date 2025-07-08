const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClothingAllSchema = new Schema({
    owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clothing_name: { type: String }, 
    category: { type: String, enum: ['Top', 'Bottom', 'Dresses', 'Shoes', 'Accessory'], required: true },
    image: {type: String, required: true},
});

const ClothingAll = mongoose.model('ClothingAll', ClothingAllSchema);
module.exports = ClothingAll;