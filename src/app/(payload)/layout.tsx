import type { ServerFunctionClient } from 'payload'
import configPromise from '../../payload.config'
import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => {
  const serverFunction: ServerFunctionClient = async function (args) {
    'use server'
    return handleServerFunctions({
      ...args,
      config: configPromise,
      importMap,
    })
  }

  return (
    <RootLayout importMap={importMap} config={configPromise} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}

export default Layout
