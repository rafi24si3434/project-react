import frameworkData from "./framework.json";

export default function FrameworkList() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Premium */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
            Framework Directory
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Katalog teknologi dan framework modern yang menggerakkan ekosistem pengembangan web masa kini.
          </p>
        </div>

        {/* Grid Layout Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {frameworkData.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              {/* Card Header & Deskripsi */}
              <div className="mb-6 flex-grow">
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                  {item.name}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-auto pt-6 border-t border-slate-100">
                
                {/* Informasi Developer dengan Ikon SVG Minimalis */}
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span className="font-medium text-slate-900 mr-1">{item.details.developer}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>Dirilis pada {item.details.releaseYear}</span>
                  </div>
                </div>

                {/* Tags Section dengan gaya "Badges" modern */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Call to Action Button Premium */}
                <a
                  href={item.details.officialWebsite}
                  className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kunjungi Website
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}