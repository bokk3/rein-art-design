import { prisma } from '../src/lib/db'

interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

interface IndexInfo {
  indexname: string
  indexdef: string
}

interface ConstraintInfo {
  constraint_name: string
  constraint_type: string
}

async function verifyTableStructure() {
  try {
    console.log('🔍 Verifying translation tables structure...\n')

    // Expected structure for translation_keys
    const expectedTranslationKeys = {
      columns: ['id', 'key', 'category', 'description', 'createdAt', 'updatedAt'],
      uniqueIndexes: ['translation_keys_key_key'],
      indexes: ['translation_keys_category_idx']
    }

    // Expected structure for translations
    const expectedTranslations = {
      columns: ['id', 'keyId', 'languageId', 'value', 'createdAt', 'updatedAt'],
      uniqueIndexes: ['translations_keyId_languageId_key'],
      indexes: ['translations_languageId_idx', 'translations_keyId_idx'],
      foreignKeys: ['translations_keyId_fkey', 'translations_languageId_fkey']
    }

    // Expected structure for component_translations
    const expectedComponentTranslations = {
      columns: ['id', 'componentId', 'pageBuilderId', 'languageId', 'fieldPath', 'value', 'createdAt', 'updatedAt'],
      uniqueIndexes: ['component_translations_componentId_pageBuilderId_languageId_fieldPath_key'],
      indexes: ['component_translations_pageBuilderId_languageId_idx', 'component_translations_componentId_idx'],
      foreignKeys: ['component_translations_languageId_fkey']
    }

    // Check translation_keys table
    console.log('📋 Checking translation_keys table...')
    const translationKeysColumns = await prisma.$queryRaw<ColumnInfo[]>`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'translation_keys'
      ORDER BY ordinal_position
    `
    
    if (translationKeysColumns.length === 0) {
      console.log('❌ translation_keys table does NOT exist\n')
    } else {
      console.log(`✅ Found ${translationKeysColumns.length} columns:`)
      translationKeysColumns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        console.log(`   - ${col.column_name}: ${col.data_type} ${nullable}`)
      })

      // Check indexes
      const translationKeysIndexes = await prisma.$queryRaw<IndexInfo[]>`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'translation_keys'
      `
      console.log(`\n   Indexes (${translationKeysIndexes.length}):`)
      translationKeysIndexes.forEach(idx => {
        const isUnique = idx.indexdef.includes('UNIQUE')
        const isPrimaryKey = idx.indexname.includes('_pkey')
        const isExpected = expectedTranslationKeys.uniqueIndexes.includes(idx.indexname) || 
                          expectedTranslationKeys.indexes.includes(idx.indexname)
        console.log(`   ${isExpected || isPrimaryKey ? '✅' : '⚠️ '} ${idx.indexname} ${isUnique ? '(UNIQUE)' : ''}`)
      })
    }

    // Check translations table
    console.log('\n📋 Checking translations table...')
    const translationsColumns = await prisma.$queryRaw<ColumnInfo[]>`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'translations'
      ORDER BY ordinal_position
    `
    
    if (translationsColumns.length === 0) {
      console.log('❌ translations table does NOT exist\n')
    } else {
      console.log(`✅ Found ${translationsColumns.length} columns:`)
      translationsColumns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        console.log(`   - ${col.column_name}: ${col.data_type} ${nullable}`)
      })

      // Check indexes
      const translationsIndexes = await prisma.$queryRaw<IndexInfo[]>`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'translations'
      `
      console.log(`\n   Indexes (${translationsIndexes.length}):`)
      translationsIndexes.forEach(idx => {
        const isUnique = idx.indexdef.includes('UNIQUE')
        const isPrimaryKey = idx.indexname.includes('_pkey')
        const isExpected = expectedTranslations.uniqueIndexes.includes(idx.indexname) || 
                          expectedTranslations.indexes.includes(idx.indexname)
        console.log(`   ${isExpected || isPrimaryKey ? '✅' : '⚠️ '} ${idx.indexname} ${isUnique ? '(UNIQUE)' : ''}`)
      })

      // Check foreign keys
      const translationsFKs = await prisma.$queryRaw<ConstraintInfo[]>`
        SELECT 
          tc.constraint_name,
          tc.constraint_type
        FROM information_schema.table_constraints tc
        WHERE tc.table_name = 'translations'
          AND tc.constraint_type = 'FOREIGN KEY'
      `
      console.log(`\n   Foreign Keys (${translationsFKs.length}):`)
      translationsFKs.forEach(fk => {
        const isExpected = expectedTranslations.foreignKeys.includes(fk.constraint_name)
        console.log(`   ${isExpected ? '✅' : '⚠️ '} ${fk.constraint_name}`)
      })
    }

    // Check component_translations table
    console.log('\n📋 Checking component_translations table...')
    const componentTranslationsColumns = await prisma.$queryRaw<ColumnInfo[]>`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'component_translations'
      ORDER BY ordinal_position
    `
    
    if (componentTranslationsColumns.length === 0) {
      console.log('❌ component_translations table does NOT exist\n')
    } else {
      console.log(`✅ Found ${componentTranslationsColumns.length} columns:`)
      componentTranslationsColumns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        console.log(`   - ${col.column_name}: ${col.data_type} ${nullable}`)
      })

      // Check indexes
      const componentTranslationsIndexes = await prisma.$queryRaw<IndexInfo[]>`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'component_translations'
      `
      console.log(`\n   Indexes (${componentTranslationsIndexes.length}):`)
      componentTranslationsIndexes.forEach(idx => {
        const isUnique = idx.indexdef.includes('UNIQUE')
        const isPrimaryKey = idx.indexname.includes('_pkey')
        const isExpected = expectedComponentTranslations.uniqueIndexes.includes(idx.indexname) || 
                          expectedComponentTranslations.indexes.includes(idx.indexname)
        // Check if it's the unique constraint (might have different name but correct columns)
        const isUniqueConstraint = isUnique && !isPrimaryKey && 
          (idx.indexdef.includes('componentId') && idx.indexdef.includes('pageBuilderId') && 
           idx.indexdef.includes('languageId') && idx.indexdef.includes('fieldPath'))
        console.log(`   ${isExpected || isPrimaryKey || isUniqueConstraint ? '✅' : '⚠️ '} ${idx.indexname} ${isUnique ? '(UNIQUE)' : ''}`)
        if (isUniqueConstraint && !isExpected) {
          console.log(`      (Note: Constraint name differs but structure is correct)`)
        }
      })

      // Check foreign keys
      const componentTranslationsFKs = await prisma.$queryRaw<ConstraintInfo[]>`
        SELECT 
          tc.constraint_name,
          tc.constraint_type
        FROM information_schema.table_constraints tc
        WHERE tc.table_name = 'component_translations'
          AND tc.constraint_type = 'FOREIGN KEY'
      `
      console.log(`\n   Foreign Keys (${componentTranslationsFKs.length}):`)
      componentTranslationsFKs.forEach(fk => {
        const isExpected = expectedComponentTranslations.foreignKeys.includes(fk.constraint_name)
        console.log(`   ${isExpected ? '✅' : '⚠️ '} ${fk.constraint_name}`)
      })
    }

    console.log('\n✅ Structure verification complete!')

  } catch (error) {
    console.error('❌ Error verifying structure:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyTableStructure()

