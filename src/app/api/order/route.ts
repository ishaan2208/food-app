import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import NodeCache from "node-cache";

const prisma = new PrismaClient();
const nodeCache = new NodeCache();

export const GET = async (req: NextRequest) => {
  const orders = await prisma.order.findMany({});
  console.log(orders);
  return NextResponse.json(orders);
};

export const POST = async (req: NextRequest) => {
  const { orderItems, source } = await req.json();

  const total = orderItems.reduce(
    (
      acc: number,
      item: {
        price: number;
        quantity: number;
      }
    ) => acc + item.price * item.quantity,
    0
  );

  const result = await prisma.$transaction(async (prisma) => {
    const order = await prisma.order.create({
      data: {
        source,
        totalAmount: total,
        totalPaid: 0,
        status: "PENDING",
      },
    });

    const array = orderItems.map((item: any) => ({
      orderId: order.id,
      foodItemId: item.id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      amount: item.price * item.quantity,
    }));

    const orderItemResult = await prisma.orderItem.createMany({
      data: array,
    });

    return { order, orderItemResult };
  });

  return NextResponse.json(result);
};

export const DELETE = async (req: NextRequest) => {
  const order = await prisma.order.deleteMany({});
  return NextResponse.json(order);
};
