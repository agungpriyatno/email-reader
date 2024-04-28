import { ImapTable } from "@/components/ImapTable";
import { imapFindMany } from "@/lib/actions/imapAction";

const ImapPage = async () => {
  const data = await imapFindMany({ take: 10, page: 1, search: "" });
  return <ImapTable initial={data} />;
};

export default ImapPage;
