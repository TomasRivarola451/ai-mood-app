export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  res.status(200).json({ mood: "chill" });
}
