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
import { clientImapFindManySession } from "@/lib/actions/clientImapAction";
import { Imap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EyeIcon,
} from "lucide-react";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TableLoading } from "./TableLoading";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";

const ClientDashboard = () => {
  const [take, setTake] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const fetcher = async () => {
    const token = localStorage.getItem("client_session");
    return await clientImapFindManySession(token ?? "", {
      page,
      take,
      search,
    });
  };

  const { data, refetch, isFetching, isError, error } = useQuery<{
    data: Imap[];
    currentPage: number;
    totalPage: number;
  }>({
    queryKey: ["client-imaps"],
    queryFn: fetcher,
    refetchInterval: 5000,
    initialData: {
      data: [],
      totalPage: 0,
      currentPage: 1,
    },
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

    refetch();
  };

  if (isFetching) {
    return <TableLoading />;
  }

  if (isError) {
    if (error instanceof ApiError) {
      if (error.statusCode == 401) {
        localStorage.removeItem("client_session");
        router.push("/signin");
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full justify-between place-items-center">
          <CardTitle>Email</CardTitle>
          <div className="flex gap-3">
            <Input placeholder="Search" onChange={onChange} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          {data?.data?.length == 0 && <TableCaption>No Data.</TableCaption>}
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
                    <Button asChild size={"icon"}>
                      <Link href={`/dashboard/${item.id}`}>
                        <EyeIcon />
                      </Link>
                    </Button>
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

export { ClientDashboard };
