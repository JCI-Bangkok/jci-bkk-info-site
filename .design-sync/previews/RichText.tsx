import { RichText } from 'jci-bkk-info-site';

const articleContent = {
  root: {
    children: [
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: 'Why JCI Bangkok?' }],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'JCI Bangkok is a local chapter of Junior Chamber International — a worldwide network of young active citizens who believe that to change the world, you must first act within it.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Our members are ' },
          { type: 'text', text: 'entrepreneurs, professionals, and community builders', format: 1 },
          { type: 'text', text: ' aged 18–40 who take on real leadership roles and run projects that matter.' },
        ],
      },
      {
        type: 'list',
        listType: 'bullet',
        children: [
          { type: 'listitem', children: [{ type: 'text', text: 'Leadership development workshops and training' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'International conferences and exchanges' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'Community impact and CSR projects' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'Business networking events in Bangkok' }] },
        ],
      },
    ],
  },
};

const shortContent = {
  root: {
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Applications for the 2026 membership cycle are now open. Spots are limited to 40 new members per intake.' },
        ],
      },
    ],
  },
};

export function ArticleBody() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8 bg-white">
      <RichText content={articleContent} />
    </div>
  );
}

export function ShortParagraph() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8 bg-white">
      <RichText content={shortContent} />
    </div>
  );
}

export function Empty() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8 bg-white">
      <RichText content={null} />
    </div>
  );
}
