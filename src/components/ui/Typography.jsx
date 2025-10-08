export function Title({ children }) {
  return <h1 className="text-3xl font-bold mb-6">{children}</h1>
}

export function Subtitle({ children }) {
  return <h2 className="text-xl font-semibold mb-4">{children}</h2>
}

export function SectionText({ children }) {
  return <p className="text-gray-600 mb-2">{children}</p>
}
