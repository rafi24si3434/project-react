export default function TailwindCSS() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-8 text-gray-800">
            
            {/* HEADER */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-rose-400 text-transparent bg-clip-text">
                    💖 Tailwind UI Pink
                </h1>
                <p className="text-gray-500 mt-3">
                    Clean • Soft • Modern Design
                </p>
            </div>

            {/* BUTTON */}
            <div className="flex justify-center mb-12">
                <button className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md hover:shadow-xl hover:scale-105 transition duration-300">
                    Click Me 🌸
                </button>
            </div>

            {/* GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                <SoftCard>
                    <Spacing title="Soft Card" content="UI clean dengan warna pink lembut 💕" />
                </SoftCard>

                <SoftCard><Typography /></SoftCard>
                <SoftCard><BorderRadius /></SoftCard>
                <SoftCard><BackgroundColors /></SoftCard>
                <SoftCard><FlexboxGrid /></SoftCard>
                <SoftCard><ShadowEffects /></SoftCard>

            </div>
        </div>
    );
}

/* WRAPPER */
function SoftCard({ children }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-pink-100">
            {children}
        </div>
    );
}

/* SPACING */
function Spacing({ title, content }) {
    return (
        <div>
            <h2 className="text-xl font-bold text-pink-500">{title}</h2>
            <p className="mt-2 text-gray-600">{content}</p>
        </div>
    );
}

/* TYPOGRAPHY */
function Typography() {
    return (
        <div>
            <h1 className="text-3xl font-extrabold text-pink-500">
                Typography
            </h1>
            <p className="mt-2 text-gray-600">
                Tailwind bikin UI jadi cepat dan cantik 🌸
            </p>
            <p className="text-sm text-gray-400 mt-1">
                Small caption text
            </p>
        </div>
    );
}

/* BORDER RADIUS */
function BorderRadius() {
    return (
        <div>
            <h3 className="font-bold mb-3 text-pink-500">Border Radius</h3>
            <div className="flex gap-3">
                <div className="w-12 h-12 bg-pink-400"></div>
                <div className="w-12 h-12 bg-pink-400 rounded-md"></div>
                <div className="w-12 h-12 bg-pink-400 rounded-xl"></div>
                <div className="w-12 h-12 bg-pink-400 rounded-full"></div>
            </div>
        </div>
    );
}

/* BACKGROUND COLORS */
function BackgroundColors() {
    return (
        <div>
            <h3 className="font-bold mb-3 text-pink-500">Colors</h3>
            <div className="grid grid-cols-4 gap-2">
                <div className="h-10 rounded-lg bg-pink-300"></div>
                <div className="h-10 rounded-lg bg-pink-400"></div>
                <div className="h-10 rounded-lg bg-pink-500"></div>
                <div className="h-10 rounded-lg bg-rose-400"></div>
            </div>
        </div>
    );
}

/* FLEXBOX */
function FlexboxGrid() {
    return (
        <div>
            <h3 className="font-bold mb-3 text-pink-500">Flexbox</h3>
            <div className="flex justify-between items-center bg-pink-500 p-3 rounded-xl text-white">
                <span className="font-bold">MyWebsite</span>
                <div className="flex gap-4 text-sm">
                    <span className="hover:underline cursor-pointer">Home</span>
                    <span className="hover:underline cursor-pointer">About</span>
                    <span className="hover:underline cursor-pointer">Contact</span>
                </div>
            </div>
        </div>
    );
}

/* SHADOW */
function ShadowEffects() {
    return (
        <div className="p-4 rounded-xl bg-pink-500 text-white shadow-md hover:shadow-2xl hover:scale-105 transition duration-300">
            <h3 className="font-bold">Shadow Effects</h3>
            <p className="text-sm mt-1 opacity-90">
                Hover aku 🌸
            </p>
        </div>
    );
}