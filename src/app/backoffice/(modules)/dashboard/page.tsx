import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clientRepo from "@/lib/repositories/clientRepo";
import imapRepo from "@/lib/repositories/imapRepo";
import userRepo from "@/lib/repositories/userRepo";

const UserDashboardPage = async () => {
  const users = await userRepo.count();
  const clients = await clientRepo.count();
  const imaps = await imapRepo.count();
  return (
    <section className="grid grid-cols-4 gap-2">
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
    </section>
  );
};

export default UserDashboardPage;
