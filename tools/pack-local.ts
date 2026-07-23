import { releaseVersion } from 'nx/release'
import { execSync } from 'child_process'
import * as fs from 'fs-extra'
import * as path from 'path'

// Same projects as the release config in nx.json
const RELEASE_PACKAGES = ['js', 'vue', 'nuxt', 'react', 'next']

async function copyPackagesToBuild() {
  const buildDir = path.join(process.cwd(), 'build')
  const packagesDir = path.join(process.cwd(), 'packages')

  // Remove build directory if it exists and create it fresh
  await fs.remove(buildDir)
  await fs.ensureDir(buildDir)
  await fs.ensureDir(path.join(buildDir, 'packages'))

  // Get all package directories
  const packageDirs = await fs.readdir(packagesDir)

  // Copy each package directory
  for (const pkg of packageDirs) {
    const srcDir = path.join(packagesDir, pkg)
    const destDir = path.join(buildDir, 'packages', pkg)

    // Only copy if it's a directory
    const stats = await fs.stat(srcDir)
    if (!stats.isDirectory()) continue

    await fs.copy(srcDir, destDir, {
      filter: (src) => {
        // Skip node_modules, test files, and dist folders
        return !src.includes('node_modules') && !src.includes('__tests__')
      },
    })
  }
}

;(async () => {
  await copyPackagesToBuild()

  // Bump versions in build/packages/* exactly like a real release,
  // but without touching git (no commit, no tag, no changelog, no publish)
  await releaseVersion({
    specifier: process.argv[2] ?? 'patch',
    gitCommit: false,
    gitTag: false,
    stageChanges: false,
  })

  const buildPackagesDir = path.join(process.cwd(), 'build', 'packages')
  const tarballDir = path.join(process.cwd(), 'build', 'tarballs')
  await fs.ensureDir(tarballDir)

  // Rewrite inter-package deps to sibling tarball files, so installing a single
  // tarball resolves @query-api/* locally instead of hitting the npm registry
  for (const pkg of RELEASE_PACKAGES) {
    const manifestPath = path.join(buildPackagesDir, pkg, 'package.json')
    const manifest = await fs.readJson(manifestPath)
    for (const depName of Object.keys(manifest.dependencies ?? {})) {
      if (!depName.startsWith('@query-api/')) continue
      const depPkg = depName.replace('@query-api/', '')
      manifest.dependencies[depName] = `file:query-api-${depPkg}-${manifest.version}.tgz`
    }
    await fs.writeJson(manifestPath, manifest, { spaces: 2 })
  }

  for (const pkg of RELEASE_PACKAGES) {
    const pkgDir = path.join(buildPackagesDir, pkg)
    execSync(`npm pack --pack-destination ${tarballDir}`, { cwd: pkgDir, stdio: 'inherit' })
  }

  console.log(`\nTarballs ready in ${tarballDir}`)

  // releaseVersion keeps handles open, exit explicitly like release.ts does
  process.exit(0)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
