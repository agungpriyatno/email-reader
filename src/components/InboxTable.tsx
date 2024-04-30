"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { emailFindMany } from "@/lib/repositories/emailRepo";
import { Imap, Mail } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { TableLoading } from "./TableLoading";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";

type Message = {};

type InboxTableProps = {
  imap?: Imap | null;
};

const InboxTable = ({ imap }: InboxTableProps) => {
  const fetcher = async () => {
    const data = await emailFindMany(imap?.user);
    console.log(data);
    return data;
  };

  const { data, refetch, isFetching, isError } = useQuery<Mail[]>({
    queryKey: ["inbox"],
    queryFn: fetcher,
    refetchInterval: 10000,
    initialData: [],
  });

  if (isFetching && data.length == 0) {
    return <TableLoading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inbox {imap?.user}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          {data?.length == 0 && <TableCaption>No Data.</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="w-[300px]">Subject</TableHead>
              <TableHead className="w-20">Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data != undefined &&
              data.map((item, i) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{item.to}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>{item.date?.toDateString()}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size={"icon"}>
                            <EyeIcon />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="p-0 h-screen overflow-y-auto max-w-xl flex flex-col">
                          <DialogClose
                            asChild
                            className=" absolute top-5 right-5 z-50"
                          >
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                          <div className="flex-1">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.html as string,
                              }}
                            ></div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { InboxTable };
