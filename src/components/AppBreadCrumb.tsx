"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import React from "react";

const AppBreadCrumb = () => {
  const pathname = usePathname();
  const seperated = pathname.split("/");
  const data = seperated.filter((item) => item != "");

  const path = (index: number) => {
    const res = "/" + data.slice(0, index + 1).join("/");
    return res;
  };
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {data.map((item, i) => (
          <React.Fragment key={i}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <BreadcrumbLink href={path(i)}>{item}</BreadcrumbLink>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadCrumb;
