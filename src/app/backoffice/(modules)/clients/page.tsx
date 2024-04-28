import { ClientTable } from "@/components/ClientTable";
import { clientFindMany } from "@/lib/actions/clientAction";

const UserPage = async () => {
  const data = await clientFindMany({ take: 10, page: 1, search: "" });
  return <ClientTable initial={data} />;
};

export default UserPage;
