export default function Footer() {
  return (
    <footer
    className="h-40 bg-gray-800 text-white flex flex-col items-center justify-center"
  >
    <h3 className="text-xl font-semibold">Contactez-nous</h3>
    <p>Email : contact@santeplus.com</p>
    <p>© {new Date().getFullYear()} Santé+</p>
  </footer>
  )
}
