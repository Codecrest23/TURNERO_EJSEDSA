import { useState, useMemo, useRef, useEffect } from "react"

export default function SelectDesplegable({
  items = [],
  value,
  onChange,
  valueKey = "id",
  labelKey = "label",
  placeholder = "Elegir...",
  className = "",
  required = false,        // 👈 NUEVO
  name = "",               // 👈 Útil si querés integrarlo con forms
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [touched, setTouched] = useState(false) // 👈 Para marcar error
  const containerRef = useRef(null)

  const seleccionado = items.find((i) => i[valueKey] === value)
  const labelActual = seleccionado ? seleccionado[labelKey] : placeholder
  const isInvalid = required && touched && !value   // 👈 ERROR si required + vacío

  // 🔍 Filtrar items según lo que escriba el usuario
  const itemsFiltrados = useMemo(() => {
    return items.filter((i) =>
      i[labelKey].toLowerCase().includes(search.toLowerCase())
    )
  }, [items, search])

  // ❗ Cerrar si clickea afuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
          <input
          type="text"
          value={value || ""}
          onChange={() => {}}
          required={required}
          className="hidden"
          />
      {/* Botón / entrada visible */}
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o)
          setSearch("") // al abrir, limpiar búsqueda
          setTouched(true)     // 👈 Se marcó como "tocó el campo"
        }}
        className={`w-full border p-2 rounded bg-white text-left flex justify-between items-center     ${isInvalid ? "border-red-500" : "border-gray-300"}`}
      >
        <span className="truncate">{labelActual}</span>
        <span className="ml-2 text-gray-500">▾</span>
      </button>
    {/* 🔽🔽 ACÁ VA EL MENSAJE DE REQUIRED 🔽🔽 */}
    {isInvalid && (
      <p className="text-red-600 text-sm mt-1">
        Este campo es obligatorio
      </p>
    )}

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-72 rounded-md border bg-white shadow-lg">
          {/* 🔎 Input de búsqueda */}
          <div className="p-2 border-b">
            <input
              type="text"
              autoFocus
              className="w-full border rounded p-2 text-sm"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Opciones */}
          <div className="max-h-60 overflow-y-auto">
            {/* Opción reset */}
            <button
              type="button"
              onClick={() => {
                onChange("")
                setOpen(false)
              }}
              className="w-full px-3 py-2 text-left text-gray-500 hover:bg-gray-100"
            >
              {placeholder}
            </button>

            {/* Items filtrados */}
            {itemsFiltrados.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">
                Sin resultados
              </div>
            ) : (
              itemsFiltrados.map((item) => {
                const id = item[valueKey]
                const label = item[labelKey]
                const isSelected = id === value

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onChange(id)
                      setOpen(false)
                      setSearch("")
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      isSelected ? "bg-blue-100 font-medium" : ""
                    }`}
                  >
                    <span className="block truncate" title={label}>
                      {label}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
