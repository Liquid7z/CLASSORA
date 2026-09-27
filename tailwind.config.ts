import type { Config } from 'tailwindcss'
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink:'#101322', brand:'#635BFF', soft:'#F5F7FF' }, boxShadow: { soft:'0 20px 60px rgba(16,19,34,.10)' } } }, plugins: [] }
export default config
