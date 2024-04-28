"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  router.push("/backoffice/signin");
  return <main className="h-screen w-full relative"></main>;
}
