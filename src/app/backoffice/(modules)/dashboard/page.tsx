import { ConnectionPannel } from "@/components/ConnectionPannel";
import { DashboardTable } from "@/components/DasboardTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findManyClient } from "@/lib/actions/dashboard";
import { generateEmail } from "@/lib/actions/generateAction";
import clientRepo from "@/lib/repositories/clientRepo";
import imapRepo from "@/lib/repositories/imapRepo";
import userRepo from "@/lib/repositories/userRepo";

const UserDashboardPage = async () => {
  const users = await userRepo.count({});
  const clients = await clientRepo.count({});
  const imaps = await imapRepo.count({});
  // const data = await findManyClient({ page: 1, take: 15, search: "" });
  return (
    <main className="w-full space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full h-full space-y-4 border-2 rounded">
          <ConnectionPannel />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <Card>
            <CardHeader>
              <CardTitle>Total User</CardTitle>
            </CardHeader>
            <CardContent>{users}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Client</CardTitle>
            </CardHeader>
            <CardContent>{clients}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Imap</CardTitle>
            </CardHeader>
            <CardContent>{imaps}</CardContent>
          </Card>
        </div>
      </div>
      <DashboardTable/>
    </main>
  );
};

export default UserDashboardPage;
