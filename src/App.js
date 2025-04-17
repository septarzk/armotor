import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import "./App.css";

function App() {
  const [mobilList, setMobilList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    tahun: "",
    km: "",
    deskripsi: "",
    gambar: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showForm, setShowForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const mobilCollection = collection(db, "mobil");

  useEffect(() => {
    const fetchData = async () => {
      const q = query(mobilCollection, orderBy("timestamp", "desc"));
      const data = await getDocs(q);
      setMobilList(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === "admin" && loginData.password === "123456") {
      setIsAdmin(true);
      setLoginData({ username: "", password: "" });
      setShowLogin(false);
    } else {
      alert("Username atau password salah!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tanggal = new Date().toLocaleDateString("id-ID");
    const newMobil = {
      ...formData,
      tanggalUpload: tanggal,
      status: "Tersedia",
      timestamp: serverTimestamp(),
    };
    const docRef = await addDoc(mobilCollection, newMobil);
    setMobilList([{ id: docRef.id, ...newMobil }, ...mobilList]);
    setFormData({ nama: "", harga: "", tahun: "", km: "", deskripsi: "", gambar: "" });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus mobil ini?")) {
      await deleteDoc(doc(db, "mobil", id));
      setMobilList(mobilList.filter((mobil) => mobil.id !== id));
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">AR MOTOR</h1>
        <p className="subtitle">Mobil Impianmu, Harga Terjangkau</p>
        <button onClick={() => setShowLogin(!showLogin)} className="menu-button">⋮</button>
      </div>

      {!isAdmin && showLogin && (
        <form onSubmit={handleLogin} className="form">
          <input name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange} />
          <input name="password" type="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
          <button type="submit">Login</button>
        </form>
      )}

      {isAdmin && (
        <div className="admin-panel">
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Tutup Form Tambah" : "Tambah Mobil"}
          </button>
          <button className="logout" onClick={() => setIsAdmin(false)}>Logout</button>
        </div>
      )}

      {isAdmin && showForm && (
        <form onSubmit={handleSubmit} className="form">
          <input name="nama" placeholder="Nama Mobil" value={formData.nama} onChange={handleChange} />
          <input name="harga" placeholder="Harga (contoh: Rp200.000.000)" value={formData.harga} onChange={handleChange} />
          <input name="tahun" placeholder="Tahun" value={formData.tahun} onChange={handleChange} />
          <input name="km" placeholder="Kilometer" value={formData.km} onChange={handleChange} />
          <input name="deskripsi" placeholder="Deskripsi" value={formData.deskripsi} onChange={handleChange} />
          <input name="gambar" placeholder="Link Gambar" value={formData.gambar} onChange={handleChange} />
          <button type="submit">Simpan Mobil</button>
        </form>
      )}

      <div className="grid">
        {mobilList.map((mobil) => (
          <div key={mobil.id} className="card">
            <img src={mobil.gambar} alt={mobil.nama} className="car-img" />
            <h3>{mobil.nama}</h3>
            <p className="price">{mobil.harga}</p>
            <p>Tahun: {mobil.tahun} | KM: {mobil.km}</p>
            <p>{mobil.deskripsi}</p>
            <p className="date">Upload: {mobil.tanggalUpload}</p>
            <a
              href={`https://wa.me/6281272312438?text=Halo%20saya%20tertarik%20dengan%20mobil%20${encodeURIComponent(mobil.nama)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa"
            >
              Hubungi via WhatsApp
            </a>
            <a href="https://g.co/kgs/T63LZf4" target="_blank" rel="noopener noreferrer" className="maps">Lihat di Google Maps</a>
            {isAdmin && (
              <button onClick={() => handleDelete(mobil.id)} className="hapus">Hapus</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
