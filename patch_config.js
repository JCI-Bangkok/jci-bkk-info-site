const fs = require('fs');
let code = fs.readFileSync('src/lib/builder/config.tsx', 'utf8');

// Update Props
code = code.replace(/    caption\?: string;\n  \};\n\};/g, 
  '    caption?: string;\n  };\n  DynamicTitle: {\n    align: "left" | "center" | "right";\n  };\n  DynamicContent: Record<string, never>;\n  DynamicEventHeader: Record<string, never>;\n  DynamicEventGallery: Record<string, never>;\n  DynamicProjectHeader: Record<string, never>;\n  DynamicProjectImpact: Record<string, never>;\n};'
);

// We also need to add useDocumentData import
code = 'import { useDocumentData } from "@/components/builder/PuckRenderer";\nimport { RichText } from "@/components/rich-text";\n' + code;

// Update components
code = code.replace(/    \},\n  \},\n\};/g, 
  '    },\n\n' +
  '    DynamicTitle: {\n' +
  '      fields: {\n' +
  '        align: {\n' +
  '          type: "radio",\n' +
  '          options: [\n' +
  '            { label: "Left", value: "left" },\n' +
  '            { label: "Center", value: "center" },\n' +
  '            { label: "Right", value: "right" },\n' +
  '          ],\n' +
  '        },\n' +
  '      },\n' +
  '      defaultProps: { align: "left" },\n' +
  '      render: ({ align }) => {\n' +
  '        const doc = useDocumentData();\n' +
  '        const title = doc?.title || "Dynamic Title Placeholder";\n' +
  '        return <h1 style={{ textAlign: align }} className="text-4xl font-bold">{title}</h1>;\n' +
  '      }\n' +
  '    },\n\n' +
  '    DynamicContent: {\n' +
  '      fields: {},\n' +
  '      defaultProps: {},\n' +
  '      render: () => {\n' +
  '        const doc = useDocumentData();\n' +
  '        if (!doc || (!doc.body && !doc.fullDescription)) return <div className="p-4 bg-gray-100 italic">[Dynamic Content Placeholder]</div>;\n' +
  '        return <RichText content={doc.body || doc.fullDescription} />;\n' +
  '      }\n' +
  '    },\n\n' +
  '    DynamicEventHeader: { fields: {}, defaultProps: {}, render: () => <DynamicEventHeader /> },\n' +
  '    DynamicEventGallery: { fields: {}, defaultProps: {}, render: () => <DynamicEventGallery /> },\n' +
  '    DynamicProjectHeader: { fields: {}, defaultProps: {}, render: () => <DynamicProjectHeader /> },\n' +
  '    DynamicProjectImpact: { fields: {}, defaultProps: {}, render: () => <DynamicProjectImpact /> }\n' +
  '  },\n};'
);

fs.writeFileSync('src/lib/builder/config.tsx', code);
