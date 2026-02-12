import "./Layout.css";

function Layout({ children }) {
  return (
    <main className="app-layout">
      {/* Capa atmosférica dinámica */}
      <div className="aura-layer" />

      {/* Contenido principal */}
      <div className="app-layout-inner">
        {children}
      </div>
    </main>
  );
}

export default Layout;
