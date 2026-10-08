import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { legacyPageTypes, type LegacyPageType } from '@/lib/builder/legacy-page-types';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // 1. Cybersecurity: Authenticate caller using Payload session
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await headers() });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required to inspect source code' }, { status: 401 });
    }

    // 2. Cybersecurity: Whitelist validation against path traversal
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('pageType');
    if (!pageType || !legacyPageTypes.includes(pageType as LegacyPageType)) {
      return NextResponse.json(
        { error: 'Invalid pageType parameter', allowed: legacyPageTypes },
        { status: 400 }
      );
    }

    // 3. Resolve path safely within src/components/legacy-pages
    const filePath = path.join(process.cwd(), 'src', 'components', 'legacy-pages', `${pageType}.tsx`);
    
    // Check file existence
    const sourceCode = await fs.readFile(filePath, 'utf-8');

    return NextResponse.json({
      pageType,
      sourceCode,
      readOnly: false,
    });
  } catch (error: any) {
    console.error('Error fetching legacy page source:', error);
    return NextResponse.json(
      { error: 'Failed to read source code', details: error?.message },
      { status: 500 }
    );
  }
}
