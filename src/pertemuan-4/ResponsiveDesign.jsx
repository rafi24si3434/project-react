import React from 'react';

export default function ResponsiveGrid() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 sm:p-10 text-white">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Responsive Design Showcase
                    </h1>
                    <p className="mt-3 text-indigo-100 text-lg max-w-2xl">
                        Eksplorasi layout adaptif menggunakan Tailwind CSS. Coba ubah ukuran layar Anda untuk melihat keajaibannya! ✨
                    </p>
                </div>

                {/* Content Section */}
                <div className="p-8 sm:p-10 space-y-16">
                    <ResponsiveText />
                    <hr className="border-slate-100" />
                    <ResponsiveWidth />
                    <hr className="border-slate-100" />
                    <ResponsiveLayout />
                </div>
                
            </div>
        </div>
    );
}

function ResponsiveText() {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg text-sm">01</span>
                Teks Dinamis
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl shadow-sm">
                <p className="text-sm md:text-lg lg:text-xl xl:text-2xl text-slate-700 font-medium leading-relaxed">
                    Coba lakukan <strong className="text-blue-700">zoom in</strong> atau <strong className="text-blue-700">zoom out</strong>. 
                    Perhatikan bahwa ukuran teks ini akan menyesuaikan dengan ukuran layar Anda secara otomatis.
                </p>
                <p className="mt-3 text-sm text-slate-500">
                    💡 <span className="italic">Tips: Coba hapus class breakpoint (md:, lg:, xl:) pada kode untuk melihat perbedaannya.</span>
                </p>
            </div>
        </section>
    );
}

function ResponsiveWidth() {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                <span className="bg-rose-100 text-rose-600 p-2 rounded-lg text-sm">02</span>
                Flexbox & Proporsi Kolom
            </h2>
            
            <div className="text-slate-600 mb-6 space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p>
                    Saat layar mencapai ukuran tablet (<code className="bg-white px-2 py-1 rounded text-rose-500 text-sm font-mono shadow-sm">md: 768px</code>) atau lebih besar, setiap kolom akan memiliki lebar <strong>50%</strong>.
                </p>
                <p>
                    Class <code className="bg-white px-2 py-1 rounded text-rose-500 text-sm font-mono shadow-sm">md:flex-row</code> pada <em>parent</em> membuat dua kolom ini sejajar horizontal. Pada layar HP, kolom akan otomatis bertumpuk vertikal (<code className="bg-white px-2 py-1 rounded text-rose-500 text-sm font-mono shadow-sm">flex-col</code>).
                </p>
            </div>
            
            {/* Flex Container */}
            <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                <div className="bg-gradient-to-br from-rose-400 to-red-500 w-full md:w-1/2 p-8 rounded-2xl shadow-md text-white font-bold text-center text-lg transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    Kolom Merah
                </div>
                <div className="bg-gradient-to-br from-sky-400 to-blue-500 w-full md:w-1/2 p-8 rounded-2xl shadow-md text-white font-bold text-center text-lg transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    Kolom Biru
                </div>
            </div>
        </section>
    );
}

function ResponsiveLayout() {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg text-sm">03</span>
                Grid Layout Modern
            </h2>
            
            <p className="text-slate-600 mb-6">
                Kotak-kotak di bawah ini menggunakan <strong>Grid Layout</strong>. Jumlah kolom akan berubah seiring membesarnya layar:
                <br className="hidden sm:block"/>
                <span className="inline-block mt-2 text-sm bg-slate-100 px-3 py-2 rounded-lg text-slate-700">
                    <span className="font-semibold">Mobile:</span> 1 Kolom &rarr; <span className="font-semibold">sm:</span> 2 Kolom &rarr; <span className="font-semibold">md:</span> 3 Kolom &rarr; <span className="font-semibold">lg:</span> 4 Kolom
                </span>
            </p>
            
            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {/* Looping untuk membuat Box agar kode lebih bersih */}
                {[1, 2, 3, 4].map((num) => (
                    <div 
                        key={num} 
                        className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col items-center justify-center"
                    >
                        <div className="h-14 w-14 bg-gradient-to-tr from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-md">
                            {num}
                        </div>
                        <span className="font-semibold text-slate-700 text-lg group-hover:text-emerald-600 transition-colors">
                            Box {num}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}