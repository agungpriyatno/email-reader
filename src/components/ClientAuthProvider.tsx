"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ClientAuthProviderProps = {
  children: React.ReactNode;
};

const ClientAuthProvider = ({ children }: ClientAuthProviderProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("client_session")) {
      router.push("/signin");
    }
  });

  return <div className="h-screen w-full">{children}</div>;
};

export default ClientAuthProvider;
