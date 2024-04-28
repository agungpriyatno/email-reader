"use client";


import AppBreadCrumb from "./AppBreadCrumb";
import ClientDropdownAvatar from "./ClientDropdownAvatar";
import ClientSidebarSheet from "./ClientSidebarSheet";
import { ModeToggle } from "./ModeToggle";

const ClientHeader = () => {

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <ClientSidebarSheet />
      <AppBreadCrumb />
      <div className="relative ml-auto flex-1 md:grow-0">

      </div>
      <ClientDropdownAvatar />
      <ModeToggle />
    </header>
  );
};

export default ClientHeader;
