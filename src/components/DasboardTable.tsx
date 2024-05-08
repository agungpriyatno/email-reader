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
import { findManyClient } from "@/lib/actions/dashboard";
import { Client, ClientImap, Imap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserCreateUpdate } from "./UserCreateUpdate";
import { ClientImapUpdate } from "./ClientImapUpdate";
import { DashboardImapUpdate } from "./DashboardImapUpdate";
import { cn } from "@/lib/utils";
import { TableLoading } from "./TableLoading";

type TData = ClientImap & { client: Client; imap: Imap };

type DashboardTableProps = {};

const DashboardTable = ({}: DashboardTableProps) => {
  const date = new Date();
  const [take, setTake] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");

  const fetcher = async () => {
    return await findManyClient({
      page,
      take,
      search,
    });
  };

  const { data, refetch, isLoading, isFetching } = useQuery<{
    data: TData[];
    currentPage: number;
    totalPage: number;
  }>({
    queryKey: ["dashboard"],
    queryFn: fetcher,
    refetchInterval: 5000,
    initialData: {
      data: [],
      currentPage: 1,
      totalPage: 0,
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    setPage(1);
    refetch();
  };

  const onChangePage = (action: "first" | "previous" | "next" | "last") => {
    if (action === "first") setPage(1);
    if (action === "previous") setPage(page - 1);
    if (action === "next") setPage(page + 1);
    if (action === "last") setPage(data.totalPage);

    refetch();
  };

  const onRefetch = async () => {
    setPage(1);
    setSearch("");
    await refetch();
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row w-full justify-between md:place-items-center gap-3">
            <CardTitle>Client</CardTitle>
            <div className="flex gap-3">
              <Input placeholder="Search" value={search} onChange={onChange} />
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
                <TableHead>Client Name</TableHead>
                <TableHead>Client Email</TableHead>
                <TableHead>Subcription</TableHead>
                <TableHead>Expired Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data?.map((item, i) => {
                return (
                  <TableRow key={item.clientId + i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{item.client.name}</TableCell>
                    <TableCell>{item.client.email}</TableCell>
                    <TableCell>{item.imap.user}</TableCell>
                    <TableCell
                      className={cn({
                        "text-red-500": date > item.expiredTime,
                      })}
                    >
                      {item.expiredTime.toDateString()}
                    </TableCell>
                    <TableCell className="flex space-x-3">
                      <ClientImapUpdate
                        data={item.expiredTime}
                        clientId={item.clientId}
                        imapId={item.imapId}
                        onActionSuccess={onRefetch}
                      >
                        <Button size={"default"}>Update Expired</Button>
                      </ClientImapUpdate>
                      <DashboardImapUpdate
                        clientId={item.clientId}
                        imapId={item.imapId}
                        onActionSuccess={onRefetch}
                      >
                        <Button size={"default"}>Update Subcription</Button>
                      </DashboardImapUpdate>
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
              disabled={data.totalPage <= data.currentPage}
              onClick={() => onChangePage("next")}
            >
              <ChevronRight />
            </Button>
            <Button
              size={"icon"}
              className="shrink-0"
              disabled={data.totalPage <= data.currentPage}
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

export { DashboardTable };
