import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import NodeCache from "node-cache";

const prisma = new PrismaClient();
const nodeCache = new NodeCache();

export const POST = async (req: NextRequest) => {
  const { name, price } = await req.json();

  const foodItem = await prisma.foodItem.create({
    data: {
      name,
      price,
    },
  });
  return NextResponse.json(foodItem);
};

export const GET = async (req: NextRequest) => {
  if (nodeCache.get("foodItems")) {
    console.log("from cache");
    return NextResponse.json(JSON.parse(nodeCache.get("foodItems") as string));
  }
  const foodItems = await prisma.foodItem.findMany();
  nodeCache.set("foodItems", JSON.stringify(foodItems), 60 * 60);
  return NextResponse.json(foodItems);
};

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();
  const foodItem = await prisma.foodItem.deleteMany({});
  return NextResponse.json(foodItem);
};
