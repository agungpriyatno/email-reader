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
import { findMessages } from "@/lib/actions/gmailAction";
import { Imap } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TableLoading } from "./TableLoading";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";

type TMessage = {
  id?: string | null;
  to?: string | null;
  from?: string | null;
  date?: Date | null;
  subject?: string | null;
  body?: string | null;
};

type InboxTableProps = {
  imap?: Imap | null;
};

const InboxTable = ({ imap }: InboxTableProps) => {
  const fetcher = async () => {
    const data = await findMessages(imap?.user);
    return data;
  };

  const { data, refetch, isFetching, isError } = useQuery<TMessage[]>({
    queryKey: ["inbox", imap?.user],
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
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="w-[100px]">Time</TableHead>
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
                    <TableCell>{item.date?.toLocaleDateString()}</TableCell>
                    <TableCell>{item.date?.toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size={"default"}>
                            View
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
                                __html: item.body ?? "",
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
