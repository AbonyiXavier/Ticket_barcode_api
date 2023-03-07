import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Ticket } from "./ticket.model";


@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Barcode {

  @prop({ unique: true })
  unique_qr_code: string;

  @prop({ type: () => Date, required: true })
  ticket_time: Date;

  @prop({ type: () => String })
  barcode_image: string // not necessarily

  @prop({ type: () => Boolean, default: false })
  is_activated: boolean

  @prop({ ref: () => String })
  ticket_name: string;
}  

const barcodeModel = getModelForClass(Barcode);

export default barcodeModel;
