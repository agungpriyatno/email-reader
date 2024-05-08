import { FilterTable } from "@/components/FilterTable";
import { findManyFilter } from "@/lib/actions/filterAction";

const ImapPage = async () => {
  const data = await findManyFilter({ take: 10, page: 1, search: "" });
  return <FilterTable initial={data} />;
};

export default ImapPage;
