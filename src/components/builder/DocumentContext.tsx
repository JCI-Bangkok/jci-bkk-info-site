"use client";
import { createContext, useContext } from 'react';
export const DocumentContext = createContext<any>(null);
export function useDocumentData() { return useContext(DocumentContext); }
