import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  { ignores: ['.next/**', 'out/**', '.agents/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
]

export default config
