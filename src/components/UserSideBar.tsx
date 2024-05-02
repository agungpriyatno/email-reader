"use client";

import { cn } from "@/lib/utils";
import {
  HomeIcon,
  KeyRoundIcon,
  MailIcon,
  MenuIcon,
  Settings,
  UserCog2Icon,
  Users2Icon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const MENU = [
  {
    name: "Dashboard",
    path: "/backoffice/dashboard",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    name: "User Management",
    path: "/backoffice/users",
    icon: <UserCog2Icon className="h-5 w-5" />,
  },
  {
    name: "Client Management",
    path: "/backoffice/clients",
    icon: <Users2Icon className="h-5 w-5" />,
  },
  {
    name: "Imap Management",
    path: "/backoffice/imaps",
    icon: <MailIcon className="h-5 w-5" />,
  },
  {
    name: "Update Password",
    path: "/backoffice/update-password",
    icon: <KeyRoundIcon className="h-5 w-5" />,
  },
];

const UserSidebar = () => {

  const pathname = usePathname();
  const menu = MENU;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/backoffice/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <MenuIcon className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        {menu.map(({ name, path, icon }, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <Link
                href={path}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                  {
                    "text-muted-foreground": path !== pathname,
                    "bg-accent text-accent-foreground": path === pathname,
                  }
                )}
              >
                {icon}
                <span className="sr-only">{name}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{name}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
};

export default UserSidebar;
