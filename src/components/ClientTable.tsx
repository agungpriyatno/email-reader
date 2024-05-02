"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clientFindMany } from "@/lib/actions/clientAction";
import { Client } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2Icon,
  EyeIcon,
  PlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClientCreateUpdate } from "./ClientCreateUpdate";
import { ClientDelete } from "./ClientDelete";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";

type ClientTableProps = {
  initial: {
    data: Client[];
    currentPage: number;
    totalPage: number;
  };
};

const ClientTable = ({ initial }: ClientTableProps) => {
  const router = useRouter();
  const [take, setTake] = useState(15);
  const [page, setPage] = useState(initial.currentPage);
  const [search, setSearch] = useState<string>("");

  const fetcher = async () => {
    return await clientFindMany({
      page,
      take,
      search,
    });
  };

  const { data, refetch, isLoading, isError } = useQuery<{
    data: Client[];
    currentPage: number;
    totalPage: number;
  }>({
    queryKey: ["clients"],
    queryFn: fetcher,
    refetchInterval: 5000,
    initialData: initial,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    refetch();
  };

  const onChangePage = (action: "first" | "previous" | "next" | "last") => {
    if (action === "first") setPage(1);
    if (action === "previous") setPage(page - 1);
    if (action === "first") setPage(page + 1);
    if (action === "last") setPage(data.totalPage);

    refetch()
  };

  return (
    <div>
     <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row w-full justify-between md:place-items-center gap-3">
            <CardTitle>Client Management</CardTitle>
            <div className="flex gap-3">
              <Input placeholder="Search" onChange={onChange} />
              <ClientCreateUpdate onActionSuccess={refetch}>
                <Button size={"icon"} className=" shrink-0">
                  <PlusIcon />
                </Button>
              </ClientCreateUpdate>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            {data?.data?.length == 0 && <TableCaption>No Data.</TableCaption>}
            {isLoading && <TableCaption>Loading..</TableCaption>}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data?.map((item, i) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                     <TableCell className=" flex space-x-3">
                      <Button asChild size={"default"}>
                        <Link href={`/backoffice/clients/${item.id}`}>
                          View
                        </Link>
                      </Button>
                      <ClientCreateUpdate data={item} onActionSuccess={refetch}>
                        <Button size={"default"}>
                          Edit
                        </Button>
                      </ClientCreateUpdate>
                      <ClientDelete id={item.id} onActionSuccess={refetch} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex gap-3">
                 <Button
            size={"icon"}
            className="shrink-0"
            disabled={data.currentPage <= 1}
            onClick={() => onChangePage("first")}
          >
            <ChevronsLeft />
          </Button>
          <Button
            size={"icon"}
            className="shrink-0"
            disabled={data.currentPage <= 1}
            onClick={() => onChangePage("previous")}
          >
            <ChevronLeft />
          </Button>
          <div className="h-10 px-3 flex justify-center place-items-center border-2 rounded">
            {data.currentPage} / {data.totalPage}
          </div>
          <Button
            size={"icon"}
            className="shrink-0"
            disabled={data.totalPage >= data.currentPage}
            onClick={() => onChangePage("next")}
          >
            <ChevronRight />
          </Button>
          <Button
            size={"icon"}
            className="shrink-0"
            disabled={data.totalPage >= data.currentPage}
            onClick={() => onChangePage("last")}
          >
            <ChevronsRight />
          </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export { ClientTable };
