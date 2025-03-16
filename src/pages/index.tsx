import dynamic from 'next/dynamic'
import { Geist, Geist_Mono } from 'next/font/google'
const Editor = dynamic(() => import('../components/Editor'), { ssr: false })

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export default function Home() {
  return (
    <main>
      <Editor />
    </main>
  )
}
