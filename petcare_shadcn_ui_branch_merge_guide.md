# Implementasi UI Modern PetCare CRM Menggunakan Shadcn UI

## Deskripsi
Project CRM PetCare akan ditingkatkan menggunakan beberapa komponen modern dari Shadcn UI agar tampilan lebih profesional, clean, dan interaktif.

Implementasi dilakukan menggunakan branch baru agar workflow Git lebih rapi dan sesuai standar pengembangan modern.

---

# 1. Membuat Branch Baru

```bash
git checkout -b feature/petcare-modern-ui
```

Cek branch aktif:

```bash
git branch
```

---

# 2. Install Shadcn UI

## Install Dependencies

```bash
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
```

## Init Shadcn UI

```bash
npx shadcn@latest init
```

Pilih:

- TypeScript : No
- Style : Default
- Base Color : Slate
- CSS File : src/index.css

---

# 3. Install Komponen UI

```bash
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add sheet
npx shadcn@latest add dropdown-menu
npx shadcn@latest add progress
```

---

# 4. UI Modern Dashboard

## Dashboard Cards Modern

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  <div className="bg-white rounded-2xl shadow-md p-6 border">
    <p className="text-gray-500 text-sm">Kunjungan Hari Ini</p>
    <h1 className="text-4xl font-bold mt-2">24</h1>
    <span className="text-green-500 text-sm">+3 dari kemarin</span>
  </div>

  <div className="bg-white rounded-2xl shadow-md p-6 border">
    <p className="text-gray-500 text-sm">Pasien Aktif</p>
    <h1 className="text-4xl font-bold mt-2">312</h1>
    <span className="text-pink-500 text-sm">+12 bulan ini</span>
  </div>
</div>
```

---

# 5. Implementasi Dialog UI

## File: Pets.jsx

```jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger className="bg-emerald-500 text-white px-4 py-2 rounded-xl">
    Detail Pet
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Detail Hewan</DialogTitle>
    </DialogHeader>

    <div className="space-y-3 mt-4">
      <p>Nama : Mochi</p>
      <p>Jenis : Kucing</p>
      <p>Umur : 2 Tahun</p>
    </div>
  </DialogContent>
</Dialog>
```

Fungsi:
- Membuka detail hewan menggunakan modal modern.
- UI lebih clean dibanding alert biasa.

---

# 6. Implementasi Table UI

## File: Appointments.jsx

```jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Pasien</TableHead>
      <TableHead>Dokter</TableHead>
      <TableHead>Jadwal</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    <TableRow>
      <TableCell>Mochi</TableCell>
      <TableCell>dr. Sari</TableCell>
      <TableCell>08:00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

Fungsi:
- Data appointment lebih rapi.
- Responsive dan modern.

---

# 7. Implementasi Tabs UI

## File: Dashboard.jsx

```jsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

<Tabs defaultValue="harian" className="w-full">
  <TabsList>
    <TabsTrigger value="harian">Harian</TabsTrigger>
    <TabsTrigger value="mingguan">Mingguan</TabsTrigger>
  </TabsList>

  <TabsContent value="harian">
    <p>Data statistik harian</p>
  </TabsContent>

  <TabsContent value="mingguan">
    <p>Data statistik mingguan</p>
  </TabsContent>
</Tabs>
```

Fungsi:
- Memisahkan statistik dashboard.
- Membuat dashboard lebih interaktif.

---

# 8. Sidebar Modern

## File: Sidebar.jsx

```jsx
<div className="h-screen bg-white border-r shadow-sm p-4">
  <h1 className="text-2xl font-bold text-emerald-500 mb-8">
    PetCare CRM
  </h1>

  <nav className="space-y-3">
    <button className="w-full bg-emerald-500 text-white rounded-xl py-3">
      Dashboard
    </button>

    <button className="w-full hover:bg-gray-100 rounded-xl py-3">
      Pets
    </button>

    <button className="w-full hover:bg-gray-100 rounded-xl py-3">
      Appointments
    </button>
  </nav>
</div>
```

---

# 9. Header Modern

## File: Header.jsx

```jsx
<div className="bg-white shadow-sm border rounded-2xl p-4 flex items-center justify-between">
  <input
    type="text"
    placeholder="Cari pasien..."
    className="border rounded-xl px-4 py-2 w-80"
  />

  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
      SP
    </div>

    <div>
      <h3 className="font-semibold">dr. Sari</h3>
      <p className="text-sm text-gray-500">Dokter Hewan</p>
    </div>
  </div>
</div>
```

---

# 10. Commit Perubahan

```bash
git add .
git commit -m "Modern UI PetCare CRM menggunakan Shadcn UI"
```

---

# 11. Merge Branch ke Main

```bash
git checkout main
git merge feature/petcare-modern-ui
```

Jika berhasil:

```bash
Already up to date.
Merge made successfully.
```

---

# 12. Push ke Github

```bash
git push origin main
```

---

# 13. Deploy ke Vercel

## Build Project

```bash
npm run build
```

## Deploy

```bash
vercel
```

---

# 14. Hasil Akhir UI

Peningkatan yang berhasil dilakukan:

- Dashboard lebih clean
- Tampilan lebih modern
- Responsive design
- User Experience meningkat
- Navigasi lebih nyaman
- Data appointment lebih rapi
- Detail pasien lebih interaktif
- CRM terlihat profesional seperti aplikasi production

---

# 15. Kesimpulan

Project PetCare CRM berhasil ditingkatkan menggunakan Shadcn UI dengan penerapan komponen modern seperti Dialog, Table, Tabs, Sheet, dan Dropdown Menu.

Semua proses pengembangan dilakukan menggunakan branch terpisah lalu berhasil di-merge ke branch main sebelum deployment ke Vercel.

Hasil akhir membuat aplikasi CRM lebih profesional, modern, dan nyaman digunakan.

