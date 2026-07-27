export async function logActivity(userId: string, action: string, details?: string) {
  try {
    await fetch("/api/activity-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, details }),
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}