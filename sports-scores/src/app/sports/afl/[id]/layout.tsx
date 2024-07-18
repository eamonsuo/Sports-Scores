const Layout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: number };
}) => (
  <div>
    <p>hello world {params.id}</p>
    {children}
  </div>
);

export default Layout;
