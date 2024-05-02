import { UpdatePasswordForm } from "@/components/UpdatePasswordForm";
import { UserUpdatePassword } from "@/components/UserUpdatePassword";
import { Loader2Icon } from "lucide-react";


const UpdatePasswordPage = async () => {
  return (
    <div className="h-full w-full flex flex-col gap-2 justify-center place-items-center">
        <UserUpdatePassword/>
    </div>
  );
};

export default UpdatePasswordPage;
