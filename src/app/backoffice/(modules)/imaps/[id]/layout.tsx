import { ButtonBack } from "@/components/ButtonBack";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="space-y-5">
      <ButtonBack />
      {children}
    </div>
  );
};

export default AppLayout;
