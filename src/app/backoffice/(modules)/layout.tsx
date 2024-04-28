import UserAuthProvider from "@/components/UserAuthProvider";
import UserHeader from "@/components/UserHeader";
import UserSidebar from "@/components/UserSideBar";

type ModuleLayoutProps = {
  children: React.ReactNode;
};

const ModuleLayout = ({ children }: ModuleLayoutProps) => {
  return (
    <UserAuthProvider>
      <div className="flex h-screen w-full flex-col bg-muted/40">
        <UserSidebar />
        <div className="flex flex-col h-full sm:gap-4 sm:py-4 sm:pl-14 relative ">
          <UserHeader />
          <main className="flex-1 overflow-hidden items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </UserAuthProvider>
  );
};

export default ModuleLayout;
