'use client'

import React, { useState, useEffect, useRef } from 'react'

interface EditableTextProps {
  value: string
  field: string | keyof any
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  multiline?: boolean
  onUpdate?: (value: string) => void
  isEditing?: boolean
}

export function EditableText({
  value,
  field,
  className,
  as: Component = 'span',
  multiline = false,
  onUpdate: customUpdate,
  isEditing = false
}: EditableTextProps) {
  const [isLocalEditing, setIsLocalEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isLocalEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isLocalEditing])

  useEffect(() => {
    setEditValue(value)
  }, [value])

  if (!isLocalEditing) {
    const ComponentElement = Component as React.ElementType
    return (
      <ComponentElement
        data-editable
        className={`${className} ${isEditing ? 'cursor-text hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-dashed rounded px-1' : ''} transition-all inline-block`}
        onClick={(e: React.MouseEvent) => {
          if (isEditing) {
            e.stopPropagation()
            setIsLocalEditing(true)
          }
        }}
        onDoubleClick={(e: React.MouseEvent) => {
          if (isEditing) {
            e.stopPropagation()
            setIsLocalEditing(true)
          }
        }}
      >
        {value || (isEditing ? <span className="text-gray-400 italic">Click to edit</span> : '')}
      </ComponentElement>
    )
  }

  const handleBlur = () => {
    if (editValue !== value && customUpdate) {
      customUpdate(editValue)
    }
    setIsLocalEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleBlur()
    } else if (e.key === 'Escape') {
      setEditValue(value)
      setIsLocalEditing(false)
    } else if (e.key === 'Enter' && multiline && e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
  }

  if (multiline) {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        data-editable
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} w-full bg-white/90 dark:bg-[#1a1a1a]/90 border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={(e) => e.stopPropagation()}
        rows={3}
      />
    )
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      data-editable
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} bg-white/90 dark:bg-[#1a1a1a]/90 border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      onClick={(e) => e.stopPropagation()}
    />
  )
}

