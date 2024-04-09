"use client";

import FoodPad from "@/components/food-pad";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";

//schema
const formSchema = z.object({
  source: z.string(),
});

const sourceArray = [
  {
    value: "ROOM",
    label: "Room",
  },
  {
    value: "TAKEAWAY",
    label: "Takeaway",
  },
  {
    value: "DELIVERY",
    label: "Delivery",
  },
  {
    value: "TABLE",
    label: "Table",
  },
];

//types
type FoodItem = {
  createdAt: string;
  id: string;
  name: string;
  quantity: number;
  price: number;
  updatedAt: string;
};

export default function Home() {
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: "",
    },
  });
  const router = useRouter();
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ orderItems, ...values });
    axios
      .post("/api/order", { orderItems, ...values })
      .then((res) => {
        console.log(res.data);
        setOrderItems([]);
        form.reset();
        router.push("/pos");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const handleAdd = (item: FoodItem) => {
    if (orderItems.some((i) => i.id === item.id)) {
      setOrderItems(
        orderItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemove = (item: FoodItem) => {
    if (item.quantity === 1) {
      setOrderItems(orderItems.filter((i) => i.id !== item.id));
    } else {
      setOrderItems(
        orderItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    }
  };

  return (
    <div className=" p-2 flex space-x-2">
      <div className=" w-2/3">
        <FoodPad array={orderItems} setArray={setOrderItems} />
      </div>
      <div className=" w-1/3 h-full">
        <div className=" bg-slate-500/10 px-2 py-5 rounded-md flex flex-col space-y-2 items-center">
          <div className=" flex flex-wrap space-x-2"></div>
          <div className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className=" flex w-full flex-col items-center space-y-2">
                  <div className=" w-full">
                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => {
                        return (
                          <FormItem className=" w-full">
                            <FormLabel>Source</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a verified email to display" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sourceArray.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={item.value}
                                  >
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div className=" h-72 overflow-auto">
                    <Table className=" w-full ring-1 ring-slate-500/30 p-2 ">
                      <TableHeader>
                        <TableRow className=" ">
                          <TableHead>Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item: FoodItem) => (
                          <TableRow key={item.id} className="">
                            <TableCell>{item.name}</TableCell>
                            <TableCell className=" flex space-x-2 min-w-12">
                              <button
                                type="button"
                                onClick={() => handleRemove(item)}
                                className=" bg-red-500 size-5 rounded-md"
                              >
                                -
                              </button>
                              <h1> {item.quantity}</h1>
                              <button
                                type="button"
                                onClick={() => handleAdd(item)}
                                className=" bg-green-500 size-5 rounded-md"
                              >
                                +
                              </button>
                            </TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.price * item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div
                    id="totals"
                    className=" text-sm border-t-2  border-slate-500/30 py-1  flex flex-col space-y-2 items-center w-full font-bold"
                  >
                    <div className=" flex justify-between border-b-[1px] py-1 border-slate-500/30 w-full">
                      <span>Subtotal</span>
                      <span>
                        {orderItems.reduce(
                          (acc, item) => acc + item.price * item.quantity,
                          0
                        )}
                      </span>
                    </div>
                    <div className=" flex justify-between border-b-[1px] py-1 border-slate-500/30 w-full">
                      <span>Tax @ 5%</span>
                      <span>
                        {orderItems.reduce(
                          (acc, item) =>
                            acc + item.price * item.quantity * 0.05,
                          0
                        )}
                      </span>
                    </div>
                    <div className=" flex justify-between border-b-[1px] py-1 border-slate-500/30 w-full">
                      <span>Total</span>
                      <span>
                        {orderItems.reduce(
                          (acc, item) =>
                            acc + item.price * item.quantity * 1.05,
                          0
                        )}
                      </span>
                    </div>
                    <div className=" w-full py-2">
                      <Button
                        className=" w-full"
                        variant={"default"}
                        type="submit"
                      >
                        Print Kot
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
