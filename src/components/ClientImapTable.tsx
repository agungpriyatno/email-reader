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
  PlusIcon
} from "lucide-react";
import { useState } from "react";
import { ClientImapCreate } from "./ClientImapCreate";
import { ClientImapDelete } from "./ClientImapDelete";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type ClientImapTableProps = {
  id: string;
  initial: {
    data: Imap[];
    currentPage: number;
    totalPage: number;
  };
};

const ClientImapTable = ({ id, initial }: ClientImapTableProps) => {
  const [take, setTake] = useState(15);
  const [page, setPage] = useState(initial.currentPage);
  const [search, setSearch] = useState<string>("");

  const fetcher = async () => {
    return await clientImapFindMany(id, {
      page,
      take,
      search,
    });
  };

  const { data, refetch, isLoading, isError } = useQuery<{
    data: Imap[];
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
    <Card>
      <CardHeader>
        <div className="flex w-full justify-between place-items-center">
          <CardTitle>Client Imap Table</CardTitle>
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
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data?.map((item, i) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell className=" space-x-3">
                    <ClientImapDelete clientId={id} imapId={item.id} onActionSuccess={refetch} />
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
  );
};

export { ClientImapTable };
