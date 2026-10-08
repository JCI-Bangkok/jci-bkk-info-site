import { getPayload } from "payload";
import configPromise from "./src/payload.config";

async function check() {
  const payload = await getPayload({ config: configPromise });
  const templates = await payload.find({ collection: "templates" });
  console.log(JSON.stringify(templates.docs.map(t => ({ id: t.id, title: t.title, type: t.type })), null, 2));
  process.exit(0);
}
check();
