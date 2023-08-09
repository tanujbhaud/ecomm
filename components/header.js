import Link from "next/link";
export default function Header({ isLoading, error, user }) {
  const navstyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "400",
  };
  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ marginTop: "5px" }} className="loader"></div>
      </div>
    );
  if (error) return <div>{error.message}</div>;
  return (
    <>
      <header style={{ width: "100%", background: "#7776BC", color: "white" }}>
        <nav
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={navstyle}>Ecomm</div>

          <div style={navstyle}>
            <Link href="products">
              {" "}
              <a>Products</a>
            </Link>
            <a href="product">Invoices</a>

            <a href="product">Customers</a>

            <a href="product">Tickets</a>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "400",
              flexDirection: "column",
            }}
          >
            {!user && (
              <>
                <Link href="/api/auth/login">Login</Link>
              </>
            )}
            {user && (
              <>
                <span style={{ marginRight: "5px" }}>
                  {" "}
                  Welcome&nbsp;
                  {user.name}
                </span>
                <img
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                  }}
                  src={user.picture}
                  alt={user.name}
                />
              </>
            )}
            {user && (
              <>
                <Link href="/api/auth/logout">Logout</Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
