"use client";
import * as React from "react";
import MyTable from "@/components/MyTable";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

//types
type Order = {
  createdAt: string;
  id: string;
  source: string;
  status: string;
  tableNo: string | null;
  totalAmount: number;
  totalPaid: number;
  updatedAt: string;
  billNumber: number;
};

export default function Home() {
  const [data, setData] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const columnHelper = createColumnHelper<Order>();
  const router = useRouter();

  const columns = [
    columnHelper.accessor("billNumber", {}),
    columnHelper.accessor("source", {}),
    columnHelper.accessor("status", {}),
    columnHelper.accessor("tableNo", {}),
    columnHelper.accessor("totalAmount", {}),
    columnHelper.accessor("totalPaid", {}),
    columnHelper.accessor("createdAt", {
      cell: (cell) => format(cell.getValue(), "yyyy-MM-dd HH:mm:ss"),
    }),
  ];

  React.useEffect(() => {
    axios.get("/api/order").then((res) => {
      console.log(res.data);
      setData(res.data);
      setLoading(false);
    });
  }, []);
  return loading ? (
    <>Loading...</>
  ) : (
    <div className=" flex flex-col space-y-2">
      <div className=" w-full ring-1 items-center ring-slate-500/30 rounded-md flex justify-between p-2">
        <h1>Dashboard</h1>
        <Button
          onClick={() => {
            router.push("/pos/new");
          }}
        >
          Add New
        </Button>
      </div>
      <MyTable columns={columns} data={data} />
    </div>
  );
}
