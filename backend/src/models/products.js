import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    reference: { type: String, required: true, trim: true},
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, default: 0 },
    images: { 
      type: [String], 
      required: true,
      validate: {
        validator: function(images) {
          return images.length > 0;
        },
        message: 'Product must have at least one image'
      }
    },
    mainImage: { 
      type: String, 
      required: true 
    },  

    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (this.isModified("images") && this.images.length > 0) {
    this.mainImage = this.images[0];
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
