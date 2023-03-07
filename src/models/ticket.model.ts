import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Category } from "./category.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Ticket {

  @prop({ type: () => String, unique: true, required: true })
  ticket_name: string;

  @prop({ type: () => Date, default: new Date(), required: true })
  ticket_time: Date;

  @prop({ type: () => String, required: true })
  ticket_description: string;

  @prop({ type: () => Number, required: true })
  ticket_amount: number;

  @prop({ ref: () => Category })
  category: Ref<Category>;

}

const ticketModel = getModelForClass(Ticket);

export default ticketModel;
// send the ticket id you want to buy
// create transaction with status pending