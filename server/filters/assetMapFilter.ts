import path from 'path'
import fs from 'fs'
import logger from '../../logger'

let assetManifest: Record<string, string> = {}

try {
  const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
  assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
} catch (e) {
  if (process.env.NODE_ENV !== 'test') {
    logger.error(e, 'Could not read asset manifest file')
  }
}

const assetMap = (url: string) => assetManifest[url] || url

export default assetMap
