type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="h-screen w-full flex justify-center place-items-center">
      {children}
    </main>
  );
};

export default AuthLayout;
