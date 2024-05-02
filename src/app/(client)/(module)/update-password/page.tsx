import { UpdatePasswordForm } from "@/components/UpdatePasswordForm";
import { Loader2Icon } from "lucide-react";


const UpdatePasswordPage = async () => {
  return (
    <div className="h-full w-full flex flex-col gap-2 justify-center place-items-center">
        <UpdatePasswordForm/>
    </div>
  );
};

export default UpdatePasswordPage;
