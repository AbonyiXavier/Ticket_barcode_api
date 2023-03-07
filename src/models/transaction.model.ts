import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Ticket } from "./ticket.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Transaction {

  @prop({ type: () => Number, required: true })
  amount: number;

  @prop({ type: () => String, required: true })
  email: string;

  @prop({ type: () => String, required: true })
  reference: string;

  @prop({ type: () => String })
  status: string

  @prop({ ref: () => Ticket })
  ticket: Ref<Ticket>;
}

const transactionModel = getModelForClass(Transaction);

export default transactionModel;
