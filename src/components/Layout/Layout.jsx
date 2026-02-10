function Layout({ children }) {
  return (
    <main className="app-layout">
      <div className="app-layout-inner">
        {children}
      </div>
    </main>
  );
}

export default Layout;
