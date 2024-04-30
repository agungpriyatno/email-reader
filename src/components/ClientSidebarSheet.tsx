"use client";

import { cn } from "@/lib/utils";
import {
  Package2,
  PanelLeft
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU } from "./ClientSideBar";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const ClientSidebarSheet = () => {
  const pathname = usePathname();
  const menu = MENU;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/dashboard"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {menu.map(({ path, name, icon }, i) => (
            <Link
              key={i}
              href={path}
              className={cn(
                "flex items-center gap-4 px-2.5",
                { "text-foreground": pathname === path },
                {
                  "text-muted-foreground hover:text-foreground":
                    pathname !== path,
                }
              )}
            >
              {icon}
              {name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default ClientSidebarSheet;
