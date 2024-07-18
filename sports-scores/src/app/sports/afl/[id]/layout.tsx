const Layout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: number };
}) => (
  <div>
    <p className="dark:text-neutral-400">hello world {params.id}</p>
    {children}
  </div>
);

export default Layout;
