import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'companyRole', 'displayOrder'],
    description: 'ข้อมูลสมาชิกทั่วไปที่จะแสดงอยู่ด้านล่างของคณะกรรมการ (Board Members)',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'companyRole',
      type: 'text',
      localized: true,
      label: 'Company / Role',
      admin: {
        description: 'ตำแหน่งและบริษัท เช่น "CEO, Acme Corp"',
      }
    },
    {
      name: 'yearJoined',
      type: 'number',
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
