import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen">
        {/* Sidebar à gauche */}
        <Sidebar />

        {/* Contenu principal à droite */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 bg-white">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
