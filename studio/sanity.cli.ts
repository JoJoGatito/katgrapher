import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ncpsxckb',
    dataset: 'production',
  },
  // Use the hostname part only (no protocol, no domain)
  // Resulting URL: https://katgrapher.sanity.studio
  studioHost: 'katgrapher',
})