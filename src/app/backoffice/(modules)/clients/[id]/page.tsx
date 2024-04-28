import { ClientImapTable } from "@/components/ClientImapTable";
import { clientFind } from "@/lib/actions/clientAction";
import { clientImapFindMany } from "@/lib/actions/clientImapAction";

type ClientDetailPageProps = {
  params: { id: string };
};

const ClientDetailPage = async ({ params: { id } }: ClientDetailPageProps) => {
  const data = await clientImapFindMany(id, { page: 1, take: 15, search: "" });
  return (
    <section>
      <ClientImapTable id={id} initial={data} />
    </section>
  );
};

export default ClientDetailPage;
