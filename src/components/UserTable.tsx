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
import { userFindMany } from "@/lib/actions/userAction";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2Icon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { UserCreateUpdate } from "./UserCreateUpdate";
import { UserDelete } from "./UserDelete";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserPassword } from "./UserPassword";

type UserTableProps = {
  initial: {
    data: User[];
    currentPage: number;
    totalPage: number;
  };
};

const UserTable = ({ initial }: UserTableProps) => {
  const [take, setTake] = useState(15);
  const [page, setPage] = useState(initial.currentPage);
  const [search, setSearch] = useState<string>("");

  const fetcher = async () => {
    return await userFindMany({
      page,
      take,
      search,
    });
  };

  const { data, refetch, isLoading, isError } = useQuery<{
    data: User[];
    currentPage: number;
    totalPage: number;
  }>({
    queryKey: ["users", page, search],
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
  };

  const onRefetch = () => refetch();

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row w-full justify-between md:place-items-center gap-3">
            <CardTitle>User Management</CardTitle>
            <div className="flex gap-3">
              <Input placeholder="Search" onChange={onChange} />
              <UserCreateUpdate onActionSuccess={refetch}>
                <Button size={"icon"} className=" shrink-0">
                  <PlusIcon />
                </Button>
              </UserCreateUpdate>
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
                    <TableCell className="flex space-x-3">
                      <UserCreateUpdate data={item} onActionSuccess={refetch}>
                        <Button size={"default"}>Edit</Button>
                      </UserCreateUpdate>
                      <UserPassword id={item.id} onActionSuccess={refetch}>
                        <Button size={"default"}>Password</Button>
                      </UserPassword>
                      <UserDelete id={item.id} onActionSuccess={refetch} />
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

export { UserTable };
