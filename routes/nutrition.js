const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/nutrition");
const nutritionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports=mongoose.model("nutrition",nutritionSchema);