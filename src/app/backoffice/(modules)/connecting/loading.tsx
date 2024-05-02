import { Loader2Icon } from "lucide-react";


const LoadingConnectingPage = async () => {
  return (
    <div className="h-screen w-full flex flex-col gap-2 justify-center place-items-center">
      <Loader2Icon size={58} className=" animate-spin" />
      <h1>Mengkoneksikan...</h1>
    </div>
  );
};

export default LoadingConnectingPage;
