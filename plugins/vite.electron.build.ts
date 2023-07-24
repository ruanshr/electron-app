import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import * as electronBuilder from 'electron-builder'
function buildBackground() {
  require('esbuild').buildSync({
    entryPoints: ['src/background.ts'],
    bundle: true,
    outfile: 'dist/background.js',
    platform: 'node',
    target: 'node12',
    external: ['electron']
  })
}

export const ElectronBuildPlugin = (): Plugin => {
  return {
    name: 'electron-bulid',
    closeBundle() {
      // vite打包完成
      buildBackground()
      // electron-builder 需要制定package.json main
      const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
      json.main = 'background.js'
      fs.writeFileSync('dist/package.json', JSON.stringify(json, null, 2))
      // electron builder 会
      fs.mkdirSync('dist/node_modules')
      electronBuilder.build({
        config: {
          directories: {
            output: path.resolve(process.cwd(), 'release'),
            app: path.resolve(process.cwd(), 'dist')
          },
          asar: true,
          appId: 'com.electron.app',
          productName: 'electron-app',
          nsis: {
            oneClick: false, // 取消一键安装
            allowToChangeInstallationDirectory: true
          }
        }
      })
    }
  }
}
