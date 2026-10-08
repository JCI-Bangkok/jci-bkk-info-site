import { getPayload } from "payload";
import configPromise from "./src/payload.config";

async function seed() {
  const payload = await getPayload({ config: configPromise });

  const existingEvent = await payload.find({ collection: "templates", where: { type: { equals: "event-single" } } });
  if (existingEvent.totalDocs === 0) {
    await payload.create({
      collection: "templates",
      data: {
        title: "Single Event View",
        type: "event-single",
        status: "published",
        puckLayout: {
          content: [
            { type: "DynamicEventHeader", props: { id: "header" } },
            { type: "DynamicContent", props: { id: "content" } },
            { type: "DynamicEventGallery", props: { id: "gallery" } }
          ],
          root: { props: { title: "Single Event Template" } },
          zones: {}
        }
      }
    });
    console.log("Seeded event-single template.");
  }

  const existingProject = await payload.find({ collection: "templates", where: { type: { equals: "project-single" } } });
  if (existingProject.totalDocs === 0) {
    await payload.create({
      collection: "templates",
      data: {
        title: "Single Project View",
        type: "project-single",
        status: "published",
        puckLayout: {
          content: [
            { type: "DynamicProjectHeader", props: { id: "p-header" } },
            {
              type: "Columns",
              props: { id: "p-columns", layout: "1-1", gap: "medium" }
            }
          ],
          root: { props: { title: "Single Project Template" } },
          zones: {
            "p-columns:col-1": [
              { type: "DynamicContent", props: { id: "p-content" } }
            ],
            "p-columns:col-2": [
              { type: "DynamicProjectImpact", props: { id: "p-impact" } }
            ]
          }
        }
      }
    });
    console.log("Seeded project-single template.");
  }

  console.log("Done.");
  process.exit(0);
}

seed();
