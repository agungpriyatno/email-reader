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
import { imapFindMany } from "@/lib/actions/imapAction";
import { Imap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PlusIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClientCreateBatch } from "./ClientCreateBatch";
import { ImapCreateUpdate } from "./ImapCreateUpdate";
import { ImapDelete } from "./ImapDelete";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type ImapCount = Imap & {
  _count: {
    clients: number;
  };
};

type ImapTableProps = {
  initial: {
    data: ImapCount[];
    currentPage: number;
    totalPage: number;
  };
};

const ImapTable = ({ initial }: ImapTableProps) => {
  const [take, setTake] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const fetcher = async () => {
    return await imapFindMany({
      page,
      take,
      search,
    });
  };

  const { data, refetch, isLoading, isError } = useQuery<{
    data: ImapCount[];
    currentPage: number;
    totalPage: number;
  }>({
    queryKey: ["clients", page],
    queryFn: fetcher,
    refetchInterval: 5000,
    initialData: initial,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    setPage(1)
    refetch();
  };

  const onChangePage = (action: "first" | "previous" | "next" | "last") => {
    if (action === "first") setPage(1);
    if (action === "previous") setPage(page - 1);
    if (action === "next") setPage(page + 1);
    if (action === "last") setPage(data.totalPage);

    refetch();
    window.scrollTo({top: 0})
  };

  const onSuccess = () => {
    refetch();
    router.refresh();
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row w-full justify-between md:place-items-center gap-3">
            <CardTitle>Email Management</CardTitle>
            <div className="flex gap-3">
              <Input placeholder="Search" onChange={onChange} />
              <ImapCreateUpdate onActionSuccess={refetch}>
                <Button size={"icon"} className=" shrink-0">
                  <PlusIcon />
                </Button>
              </ImapCreateUpdate>
              <ClientCreateBatch>
              <Button>Batch</Button>
            </ClientCreateBatch>
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
                <TableHead>Email</TableHead>
                <TableHead>Subcribers</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data?.map((item, i) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{item.user}</TableCell>
                    <TableCell>{item._count.clients}</TableCell>
                    <TableCell className=" flex space-x-3">
                      <Button asChild size={"default"}>
                        <Link href={`/backoffice/imaps/subcribers/${item.id}`}>Subcribers</Link>
                      </Button>
                      <Button asChild size={"default"}>
                        <Link href={`/backoffice/imaps/${item.id}`}>Inbox</Link>
                      </Button>
                      <ImapCreateUpdate data={item} onActionSuccess={refetch}>
                        <Button size={"default"}>Edit</Button>
                      </ImapCreateUpdate>
                      <ImapDelete id={item.id} onActionSuccess={refetch} />
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

export { ImapTable };
