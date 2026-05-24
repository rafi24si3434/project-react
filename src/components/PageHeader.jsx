export default function PageHeader({
  title,
  breadcrumb = [],
  children,
  onAdd,        // optional handler
  addLabel,     // optional button text
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      
      {/* Left */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          {title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          {Array.isArray(breadcrumb) ? (
            breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                <span
                  className={
                    index === breadcrumb.length - 1
                      ? "text-gray-400"
                      : "text-gray-500"
                  }
                >
                  {item}
                </span>
                {index < breadcrumb.length - 1 && <span>/</span>}
              </span>
            ))
          ) : (
            <span>{breadcrumb}</span>
          )}
        </div>
      </div>

      {/* Right */}
      <div>
        {children ? (
          children
        ) : onAdd ? (
          <button
            onClick={onAdd}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-sm text-sm"
          >
            {addLabel || "+ Add"}
          </button>
        ) : null}
      </div>
    </div>
  );
}