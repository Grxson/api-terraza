import mongoose from "mongoose";


const orderDetailSchema = new mongoose.Schema(
  {
    orden_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    producto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cantidad: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema, "order_details");

export default OrderDetail;
