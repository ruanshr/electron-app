import type { Plugin } from 'vite'
import type { AddressInfo } from 'node:net'
import { spawn } from 'node:child_process'
import fs from 'fs'

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
export const ElectronDevPlugin = (): Plugin => {
  return {
    name: 'electron-dev',
    configureServer(server) {
      buildBackground()
      server.httpServer?.once('listening', () => {
        const addressInfo = server.httpServer?.address() as AddressInfo
        const port = addressInfo.port
        const ip = `http://localhost:${port}`
        console.log(ip)
        let electronProcess = spawn(require('electron'), ['dist/background.js', ip])
        fs.watchFile('src/background.ts', () => {
          if (electronProcess) {
            electronProcess.kill()
          }
          buildBackground()
          electronProcess = spawn(require('electron'), ['dist/background.js', ip])
        })

        electronProcess.stderr.on('data', (data) => {
          console.error('日志' + data.toString())
        })
      })
    }
  }
}
