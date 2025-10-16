import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'

import category from '../sanity-schemas/category.js'
import photo from '../sanity-schemas/photo.js'
import project from '../sanity-schemas/project.js'
import settings from '../sanity-schemas/settings.js'

export default defineConfig({
  name: 'katgrapher-studio',
  title: 'KatGrapher Studio',
  projectId: 'ncpsxckb',
  dataset: 'production',
  basePath: '/',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [category, photo, project, settings],
  },
})