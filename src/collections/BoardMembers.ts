import type { CollectionConfig } from 'payload'
import { revalidateBoardMember, revalidateDeleteBoardMember } from './hooks/revalidate'

export const BoardMembers: CollectionConfig = {
  slug: 'board-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'year', 'displayOrder'],
  },
  hooks: {
    afterChange: [revalidateBoardMember],
    afterDelete: [revalidateDeleteBoardMember],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'bio',
      type: 'richText',
      localized: true,
    },
    {
      name: 'companyRole',
      type: 'text',
      localized: true,
    },
    {
      name: 'linkedin',
      type: 'text',
    },
    {
      name: 'displayOrder',
      type: 'number',
      required: true,
      defaultValue: 10,
    },
  ],
}
