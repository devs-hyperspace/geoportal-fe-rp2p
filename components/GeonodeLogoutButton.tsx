import { useState } from "react";
import { Button } from "./ui/button";

export default function GeonodeLogoutButton() {
  const [status, setStatus] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/gn/logout", {
        method: "POST",
      });

      if (response.ok) {
        setStatus("Logout successful");
      } else {
        const data = await response.json();
        setStatus(data.error || "Logout failed");
      }
    } catch (error) {
      setStatus("Error logging out");
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
      {status && <p>{status}</p>}
    </div>
  );
}
