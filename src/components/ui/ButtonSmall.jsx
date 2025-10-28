export default function ButtonSmall({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) {
  const base =
    "rounded-md font-medium focus:outline-none transition duration-200 ease-in-out whitespace-nowrap px-2 py-1 text-xs";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    gray: "bg-gray-400 text-white hover:bg-gray-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
