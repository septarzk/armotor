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

  const mobilCollection = collection(db, "mobil");

  useEffect(() => {
    const fetchData = async () => {
      const q = query(mobilCollection, orderBy("timestamp", "desc"));
      const data = await getDocs(q);
      setMobilList(
        data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
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
    setFormData({
      nama: "",
      harga: "",
      tahun: "",
      km: "",
      deskripsi: "",
      gambar: "",
    });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus mobil ini?");
    if (konfirmasi) {
      await deleteDoc(doc(db, "mobil", id));
      setMobilList(mobilList.filter((mobil) => mobil.id !== id));
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const inputStyle = {
    display: "block",
    marginBottom: "10px",
    padding: "10px",
    width: "100%",
    maxWidth: "400px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const tombolStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "red", fontSize: "36px" }}>AR MOTOR</h1>
        <p style={{ fontSize: "18px" }}>Mobil Impianmu, Harga Terjangkau</p>
      </div>

      {!isAdmin ? (
        <form
          onSubmit={handleLogin}
          style={{
            marginBottom: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Login Admin</h3>
          <input
            style={inputStyle}
            placeholder="Username"
            name="username"
            value={loginData.username}
            onChange={handleLoginChange}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
          />
          <button type="submit" style={tombolStyle}>
            Login
          </button>
        </form>
      ) : (
        <>
          <div style={{ marginBottom: "15px" }}>
            <button onClick={toggleForm} style={tombolStyle}>
              {showForm ? "Tutup Form Tambah" : "Tambah Mobil"}
            </button>
            <button
              onClick={() => setIsAdmin(false)}
              style={{
                ...tombolStyle,
                backgroundColor: "#6c757d",
                marginLeft: "10px",
              }}
            >
              Logout
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
              <input
                style={inputStyle}
                placeholder="Nama Mobil"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
              <input
                style={inputStyle}
                placeholder="Harga (contoh: Rp200.000.000)"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
              />
              <input
                style={inputStyle}
                placeholder="Tahun"
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
              />
              <input
                style={inputStyle}
                placeholder="Kilometer"
                name="km"
                value={formData.km}
                onChange={handleChange}
              />
              <input
                style={inputStyle}
                placeholder="Deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
              />
              <input
                style={inputStyle}
                placeholder="Link Gambar"
                name="gambar"
                value={formData.gambar}
                onChange={handleChange}
              />
              <button type="submit" style={tombolStyle}>
                Simpan Mobil
              </button>
            </form>
          )}
        </>
      )}

      <div style={{ marginTop: "30px" }}>
        {mobilList.map((mobil) => (
          <div
            key={mobil.id}
            style={{
              display: "flex",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
              alignItems: "center",
            }}
          >
            <img
              src={mobil.gambar}
              alt={mobil.nama}
              style={{
                width: "150px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                marginRight: "15px",
              }}
            />
            <div style={{ flex: 1 }}>
              <h3>{mobil.nama}</h3>
              <p style={{ color: "red", fontWeight: "bold" }}>{mobil.harga}</p>
              <p>
                Tahun: {mobil.tahun} | KM: {mobil.km}
              </p>
              <p>Tanggal Upload: {mobil.tanggalUpload}</p>
              <p>
                Status: <b>{mobil.status}</b>
              </p>
              <p>{mobil.deskripsi}</p>
              <a
                href={`https://wa.me/6281272312438?text=Halo%20saya%20tertarik%20dengan%20mobil%20${encodeURIComponent(
                  mobil.nama
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...tombolStyle,
                  backgroundColor: "#25D366",
                  textDecoration: "none",
                  display: "inline-block",
                  marginTop: "8px",
                }}
              >
                Hubungi via WhatsApp
              </a>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(mobil.id)}
                  style={{
                    ...tombolStyle,
                    backgroundColor: "#dc3545",
                    marginTop: "8px",
                    marginLeft: "10px",
                  }}
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;






