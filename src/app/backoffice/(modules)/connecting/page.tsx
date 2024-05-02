import { Button } from "@/components/ui/button";
import { connectToGmail } from "@/lib/actions/gmailAction";
import { CheckCircleIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";

type ConnectingPageProps = { searchParams: { code: string } };

const ConnectingPage = async ({
  searchParams: { code },
}: ConnectingPageProps) => {
  await connectToGmail(code);
  return (
    <div className="h-screen w-full flex flex-col gap-2 justify-center place-items-center">
      <CheckCircleIcon size={58} />
      <h1>Berhasil Terkoneksi</h1>
      <Button asChild>
        <Link href={"/backoffice/dashboard"}>Kembali</Link>
      </Button>
    </div>
  );
};

export default ConnectingPage;
