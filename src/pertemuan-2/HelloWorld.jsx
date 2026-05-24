import { createRoot } from "react-dom/client";

export default function HelloWorld() {
        const propsUserCard = {
        nama: "Goku",
        nim: "999999",
        tanggal: "2025-01-01"
    }

  return (
    <div>
      <h1>Hallo Mido</h1>
      <img src="img/miawmiaw.png" alt="Miaw Miaw"width="100%" />
      <p>Selamat Belajar ReactJs</p>
      <MidoGanteng />
      <QuoteText />
      <UserCard
        nama="Mido Herdiansyah"
        nim="2457301086"
        tanggal={new Date().toLocaleDateString()}
      />
      <UserCard
        nama="Sigit Jawa"
        nim="2457301086"
        tanggal={new Date().toLocaleDateString()}
      />
      <UserCard {...propsUserCard}
      />
    </div>
  );
}

function QuoteText() {
  const text = "Sigit Jawa";
  const text2 = "Aku ingin Jadi Jawa";
  return (
    <div>
      <hr />
      <p>{text.toLowerCase()}</p>
      <p>{text2.toUpperCase()}</p>
    </div>
  );
}
// createRoot(document.getElementById("root")).render(
//   <div>
//     <HelloWorld />
//     <HelloWorld />
//     <HelloWorld />
//   </div>,
// );
function MidoGanteng() {
  return <small>Mido Ganteng Banget</small>;
}

function UserCard(props) {
  return (
    <div className="card">
      <hr />
      <h3>Nama: {props.nama}</h3>
      <p>NIM: {props.nim}</p>
      <p>Tanggal: {props.tanggal}</p>
    </div>
  );
}
