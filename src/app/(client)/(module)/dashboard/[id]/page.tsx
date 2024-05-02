import { InboxTable } from "@/components/InboxTable";
import { imapFind } from "@/lib/actions/imapAction";

type ImapsDetailPageProps = {
  params: { id: string };
};


const ImapsDetailPage = async ({ params: { id } }: ImapsDetailPageProps) => {
  const {data} = await imapFind(id);
  return <InboxTable imap={data} />;
};

export default ImapsDetailPage;
