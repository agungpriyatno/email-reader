import { UserTable } from "@/components/UserTable";
import { userFindMany } from "@/lib/actions/userAction";

const UserPage = async () => {
  const data = await userFindMany({ take: 10, page: 1, search: "" });
  return <UserTable initial={data} />;
};

export default UserPage;
