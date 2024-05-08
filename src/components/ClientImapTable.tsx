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
import { clientImapFindMany } from "@/lib/actions/clientImapAction";
import { Imap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2Icon,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";
import { ClientImapCreate } from "./ClientImapCreate";
import { ClientImapDelete } from "./ClientImapDelete";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ClientImapUpdate } from "./ClientImapUpdate";
import { cn } from "@/lib/utils";

type TImap = Imap & { expiredTime: Date };

type ClientImapTableProps = {
  id: string;
  initial: {
    data: TImap[];
    currentPage: number;
    totalPage: number;
  };
};

const ClientImapTable = ({ id, initial }: ClientImapTableProps) => {
  const [take, setTake] = useState(15);
  const [page, setPage] = useState(initial.currentPage);
  const [search, setSearch] = useState<string>("");

  const fetcher = async () => {
    const data = await clientImapFindMany(id, {
      page,
      take,
      search,
    });

    return data;
  };

  const { data, refetch, isLoading, isError } = useQuery<{
    data: TImap[];
    currentPage: number;
    totalPage: number;
  }>({
    queryKey: ["client-imaps"],
    queryFn: fetcher,
    refetchInterval: 5000,
    initialData: initial,
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

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full justify-between place-items-center">
          <CardTitle>Client Subcription</CardTitle>
          <div className="flex gap-3">
            <Input placeholder="Search" onChange={onChange} />
            <ClientImapCreate id={id} onActionSuccess={refetch}>
              <Button size={"icon"} className=" shrink-0">
                <PlusIcon />
              </Button>
            </ClientImapCreate>
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
              <TableHead>User</TableHead>
              <TableHead>ExpiredAt</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data?.map((item, i) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell
                    className={cn({
                      "text-red-500": new Date() > item.expiredTime,
                    })}
                  >
                    {item.expiredTime.toDateString()}
                  </TableCell>
                  <TableCell className=" flex space-x-3 gap-2">
                    <ClientImapUpdate
                      imapId={item.id}
                      clientId={id}
                      data={item.expiredTime}
                      onActionSuccess={refetch}
                    >
                      <Button size={"icon"}>Edit</Button>
                    </ClientImapUpdate>
                    <ClientImapDelete
                      clientId={id}
                      imapId={item.id}
                      onActionSuccess={refetch}
                    />
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
  );
};

export { ClientImapTable };
