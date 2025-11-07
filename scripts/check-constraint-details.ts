import { prisma } from '../src/lib/db'

async function checkConstraintDetails() {
  try {
    console.log('🔍 Checking constraint details...\n')

    // Check the actual unique constraint on component_translations
    const constraintDetails = await prisma.$queryRaw<Array<{
      constraint_name: string
      table_name: string
      constraint_type: string
      constraint_definition: string
    }>>`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'component_translations'
        AND tc.constraint_type = 'UNIQUE'
      ORDER BY kcu.ordinal_position
    `

    console.log('Unique constraints on component_translations:')
    const constraintGroups = new Map<string, string[]>()
    
    constraintDetails.forEach(row => {
      if (!constraintGroups.has(row.constraint_name)) {
        constraintGroups.set(row.constraint_name, [])
      }
      constraintGroups.get(row.constraint_name)!.push(row.column_name)
    })

    constraintGroups.forEach((columns, constraintName) => {
      console.log(`\n  Constraint: ${constraintName}`)
      console.log(`  Columns: ${columns.join(', ')}`)
      
      const expectedColumns = ['componentId', 'pageBuilderId', 'languageId', 'fieldPath']
      const hasAllColumns = expectedColumns.every(col => columns.includes(col))
      const hasCorrectName = constraintName === 'component_translations_componentId_pageBuilderId_languageId_fieldPath_key'
      
      if (hasAllColumns && hasCorrectName) {
        console.log('  ✅ Structure is correct!')
      } else {
        console.log('  ⚠️  Issue detected:')
        if (!hasAllColumns) {
          const missing = expectedColumns.filter(col => !columns.includes(col))
          console.log(`     Missing columns: ${missing.join(', ')}`)
        }
        if (!hasCorrectName) {
          console.log(`     Expected name: component_translations_componentId_pageBuilderId_languageId_fieldPath_key`)
          console.log(`     Actual name: ${constraintName}`)
        }
      }
    })

    // Also check indexes
    console.log('\n\nIndexes on component_translations:')
    const indexes = await prisma.$queryRaw<Array<{
      indexname: string
      indexdef: string
    }>>`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'component_translations'
    `

    indexes.forEach(idx => {
      console.log(`\n  ${idx.indexname}`)
      console.log(`  Definition: ${idx.indexdef}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkConstraintDetails()

