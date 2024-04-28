import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen w-full relative">
      <section className=" absolute left-0 top-0 w-full h-full z-10">
        <div className="h-full w-full flex flex-col justify-center place-items-center space-y-3">
          <h1 className=" text-3xl font-bold">BACKOFFICE</h1>
          <Button asChild>
            <Link href={"/backoffice/signin"}>MASUK</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
