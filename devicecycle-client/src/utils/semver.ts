/**
 * Parses a semver string like "1.2.3" or "v2.0.0" into [major, minor, patch].
 */
function parse(v: string): [number, number, number] {
  const parts = v.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0)
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0]
}

/**
 * Compares two semver strings.
 * Returns -1 if a < b, 0 if equal, 1 if a > b.
 */
export function compareSemVer(a: string, b: string): number {
  const [aMaj, aMin, aPat] = parse(a)
  const [bMaj, bMin, bPat] = parse(b)
  if (aMaj !== bMaj) return aMaj > bMaj ? 1 : -1
  if (aMin !== bMin) return aMin > bMin ? 1 : -1
  if (aPat !== bPat) return aPat > bPat ? 1 : -1
  return 0
}

/**
 * Returns the type of version bump when going from oldVer → newVer.
 */
export function getVersionBumpType(
  oldVer: string,
  newVer: string,
): 'major' | 'minor' | 'patch' | 'same' {
  const [oMaj, oMin, oPat] = parse(oldVer)
  const [nMaj, nMin, nPat] = parse(newVer)
  if (nMaj !== oMaj) return 'major'
  if (nMin !== oMin) return 'minor'
  if (nPat !== oPat) return 'patch'
  return 'same'
}

/**
 * Sorts an array of items by their semver version (descending = newest first by default).
 */
export function sortBySemVer<T>(
  items: T[],
  getVersion: (item: T) => string,
  descending = true,
): T[] {
  return [...items].sort((a, b) => {
    const cmp = compareSemVer(getVersion(a), getVersion(b))
    return descending ? -cmp : cmp
  })
}

/**
 * Returns true if candidate is strictly newer than baseline.
 */
export function isNewerVersion(candidate: string, baseline: string): boolean {
  return compareSemVer(candidate, baseline) > 0
}
