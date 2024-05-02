"use client";

import { checkConnection } from "@/lib/actions/gmailAction";
import { useQuery } from "@tanstack/react-query";
import { CheckCheckIcon, Loader2Icon, MailWarningIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { gmail_v1 } from "googleapis";

const ConnectionPannel = () => {
  const fetcher = async () => {
    return await checkConnection();
  };
  const { data, isFetching, isError } = useQuery<gmail_v1.Schema$Profile>({
    queryKey: ["check"],
    queryFn: fetcher,
  });

  if (isFetching) {
    return (
      <div className="h-full flex flex-col justify-center place-items-center gap-3">
        <Loader2Icon className=" animate-spin" />
        <h1>Pengecekan..</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col justify-center place-items-center gap-3">
        <MailWarningIcon />
        <h1>Gagal terhubung dengan GMAIL</h1>
        <Button asChild>
          <Link href={"/api/oauth"}>Hubungkan Kembali</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center place-items-center gap-3">
      <CheckCheckIcon />
      <h1>Berhasi terhubung dengan GMAIL</h1>
      <div className="">
        <div className="grid text-center">
          <span className="">Email</span>
          <span className="text-lg font-bold">{data?.emailAddress}</span>
        </div>
        <div className="grid text-center">
          <span className="">Total Pesan</span>
          <span className="text-lg font-bold">{data?.messagesTotal}</span>
        </div>
      </div>
    </div>
  );
};

export { ConnectionPannel };
