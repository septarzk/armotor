import React, { useState } from "react";
import { db } from "../firebase";
import { ref, push } from "firebase/database";

const FormUploadMobil = () => {
  const [data, setData] = useState({
    nama: "",
    harga: "",
    km: "",
    tahun: "",
    deskripsi: "",
    gambar: "",
    status: "tersedia",
    tanggal: new Date().toLocaleDateString(),
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mobilRef = ref(db, "mobil");
      await push(mobilRef, data);
      alert("Data mobil berhasil diupload!");
      setData({
        nama: "",
        harga: "",
        km: "",
        tahun: "",
        deskripsi: "",
        gambar: "",
        status: "tersedia",
        tanggal: new Date().toLocaleDateString(),
      });
    } catch (error) {
      alert("Gagal upload: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white shadow rounded-xl mt-4">
      <h2 className="text-xl font-bold mb-4">Upload Data Mobil</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input name="nama" placeholder="Nama Mobil" value={data.nama} onChange={handleChange} className="border p-2 rounded" required />
        <input name="harga" placeholder="Harga" value={data.harga} onChange={handleChange} className="border p-2 rounded" required />
        <input name="km" placeholder="Kilometer" value={data.km} onChange={handleChange} className="border p-2 rounded" required />
        <input name="tahun" placeholder="Tahun" value={data.tahun} onChange={handleChange} className="border p-2 rounded" required />
        <input name="gambar" placeholder="Link Gambar" value={data.gambar} onChange={handleChange} className="border p-2 rounded" required />
        <textarea name="deskripsi" placeholder="Deskripsi" value={data.deskripsi} onChange={handleChange} className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Upload</button>
      </form>
    </div>
  );
};

export default FormUploadMobil;
