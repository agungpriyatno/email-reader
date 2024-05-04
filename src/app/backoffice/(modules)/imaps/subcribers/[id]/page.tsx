import { SubcribtionTable } from "@/components/SubcriptionTable";
import { imapClientFindMany } from "@/lib/actions/clientImapAction";

type ClientDetailPageProps = {
  params: { id: string };
};

const ClientDetailPage = async ({ params: { id } }: ClientDetailPageProps) => {
  const data = await imapClientFindMany(id, { page: 1, take: 15, search: "" });
  return (
    <section>
      <SubcribtionTable id={id} initial={data} />
    </section>
  );
};

export default ClientDetailPage;
