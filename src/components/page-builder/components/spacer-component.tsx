'use client'

import React from 'react'
import { ComponentData } from '@/types/page-builder'

interface SpacerComponentProps {
  data: ComponentData
}

export function SpacerComponent({ data }: SpacerComponentProps) {
  return (
    <div 
      style={{
        height: `${data.height || 60}px`,
        backgroundColor: data.backgroundColor || 'transparent'
      }}
    />
  )
}

