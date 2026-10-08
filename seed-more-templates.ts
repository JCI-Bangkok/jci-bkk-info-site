import { getPayload } from "payload";
import configPromise from "./src/payload.config";

async function seed() {
  const payload = await getPayload({ config: configPromise });

  const existingNews = await payload.find({ collection: "templates", where: { type: { equals: "news-single" } } });
  if (existingNews.totalDocs === 0) {
    await payload.create({
      collection: "templates",
      data: {
        title: "Single News Article",
        type: "news-single",
        status: "published",
        puckLayout: {
          content: [
            { type: "DynamicContent", props: { id: "content" } }
          ],
          root: { props: { title: "Single News Article" } },
          zones: {}
        }
      }
    });
    console.log("Seeded news-single template.");
  }

  const existingBoard = await payload.find({ collection: "templates", where: { type: { equals: "member-board-year" } } });
  if (existingBoard.totalDocs === 0) {
    await payload.create({
      collection: "templates",
      data: {
        title: "Board Members View",
        type: "member-board-year",
        status: "published",
        puckLayout: {
          content: [
            { type: "DynamicContent", props: { id: "content" } }
          ],
          root: { props: { title: "Board Members View" } },
          zones: {}
        }
      }
    });
    console.log("Seeded member-board-year template.");
  }

  console.log("Done.");
  process.exit(0);
}

seed();
