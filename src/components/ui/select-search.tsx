"use client";

import { clientImapFindManyNotID } from "@/lib/actions/clientImapAction";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDownIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./button";
import { FormControl } from "./form";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { findManyImapClient } from "@/lib/actions/dashboard";

type SelecSearchProp = {
  id: string;
  index: number;
  onChange: (id: string, user: string) => void;
  value?: string;
  whitelist: {
    user: string;
    imapId: string;
    expiredTime: string;
  }[];
};

const SelectSearch = ({
  id,
  index,
  onChange,
  value,
  whitelist,
}: SelecSearchProp) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetcher = async () => {
    const resp = await clientImapFindManyNotID({ id, search });
    const data = resp.data.filter((item) => {
      const included = whitelist.find((d) => d.imapId === item.id);
      return !included;
    });
    return { data };
  };

  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["imap-list-select", index],
    queryFn: fetcher,
  });

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    refetch();
  };

  const onSelected = (id: string, user: string) => {
    onChange(id, user);
    setOpen(false);
    setSearch("");
  };

  const onOpenChange = (val: boolean) => {
    setOpen(val);
    refetch();
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-full justify-between")}
          >
            {(value?.length ?? 0) === 0 && "Select Email"}
            {(value?.length ?? 0) > 0 && value}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="xl:w-[500px] p-0">
        <div className="p-3 w-full">
          <Input placeholder="Search" onChange={onSearch} />
        </div>
        <ul className="max-h-[400px] overflow-hidden">
          {data?.data.map((item) => (
            <li
              key={item.id}
              className="px-4 py-2 hover:bg-secondary"
              onClick={() => onSelected(item.id, item.user)}
            >
              {item.user}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

const SelectSearch2 = ({
  id,
  index,
  onChange,
  value,
  whitelist,
}: SelecSearchProp) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetcher = async () => {
    const data = await findManyImapClient(id, { take: 15, page: 1, search });
    return { data };
  };

  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["imap-list-select-2", index],
    queryFn: fetcher,
  });

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    refetch();
  };

  const onSelected = (id: string, user: string) => {
    onChange(id, user);
    setOpen(false);
    setSearch("");
  };

  const onOpenChange = (val: boolean) => {
    setOpen(val);
    refetch();
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-full justify-between")}
          >
            {(value?.length ?? 0) === 0 && "Select Email"}
            {(value?.length ?? 0) > 0 && value}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="xl:w-[500px] p-0">
        <div className="p-3 w-full">
          <Input placeholder="Search" onChange={onSearch} />
        </div>
        <ul className="max-h-[400px] overflow-hidden">
          {data?.data.data.map((item) => (
            <li
              key={item.id}
              className="px-4 py-2 hover:bg-secondary"
              onClick={() => onSelected(item.id, item.user)}
            >
              {item.user}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export { SelectSearch, SelectSearch2 };
