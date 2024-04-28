"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type UserAuthProviderProps = {
  children: React.ReactNode;
};

const UserAuthProvider = ({ children }: UserAuthProviderProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("user_session")) {
      router.push("/backoffice/signin");
    }
  });

  return <div className="h-screen w-full">{children}</div>;
};

export default UserAuthProvider;
