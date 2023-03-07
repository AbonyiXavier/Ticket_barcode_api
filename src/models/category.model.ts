import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Category {

  @prop({ type: () => String, unique: true, required: true })
  name: string;

}

const categoryModel = getModelForClass(Category);

export default categoryModel;
