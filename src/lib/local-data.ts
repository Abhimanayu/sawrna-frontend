import os from "os";
import path from "path";

export function getLocalDataDir() {
  if (process.env.SAWRNA_DATA_DIR) return process.env.SAWRNA_DATA_DIR;
  if (process.env.VERCEL) return path.join(os.tmpdir(), "sawrna-data");
  return path.join(process.cwd(), ".sawrna-data");
}
