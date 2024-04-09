"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FoodItem = {
  createdAt: string;
  id: string;
  name: string;
  price: number;
  updatedAt: string;
};

export default function FoodPad({
  array,
  setArray,
}: {
  array: FoodItem[];
  setArray: (array: FoodItem[]) => any;
}) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const clickHandler = (foodItem: any) => {
    if (array.some((item) => item.id === foodItem.id)) {
      setArray(
        array.map((item: any) =>
          item.id === foodItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setArray([...array, { ...foodItem, quantity: 1 }]);
    }
  };
  useEffect(() => {
    axios
      .get("/api/fooditem")
      .then((res) => {
        console.log(res.data);
        setFoodItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className=" w-full h-full ring-1 p-2 ring-slate-500/30 rounded-md">
      <div className=" grid grid-cols-4 gap-2">
        {foodItems.map((foodItem) => (
          <FoodItemCard
            key={foodItem.id}
            foodItem={foodItem}
            handleClick={clickHandler}
          />
        ))}
      </div>
    </div>
  );
}

function FoodItemCard({
  foodItem,
  handleClick,
}: {
  foodItem: FoodItem;
  handleClick: any;
}) {
  return (
    <Card
      className=" bg-slate-500/10 cursor-pointer hover:scale-[1.02] duration-200 ease-in-out"
      onClick={() => handleClick(foodItem)}
    >
      <CardHeader>
        <CardTitle>{foodItem.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription> ₹{foodItem.price}</CardDescription>
      </CardContent>
      {/* <CardFooter>
        <button>Delete</button>
      </CardFooter> */}
    </Card>
  );
}
