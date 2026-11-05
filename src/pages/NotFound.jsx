import { Link } from "react-router";

function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-[#3D1648]">
        404
      </h1>

      <p>ไม่พบหน้าที่ต้องการ</p>

      <Link to="/" className="btn bg-[#3D1648] text-white">
        กลับหน้าหลัก
      </Link>
    </main>
  );
}

export default NotFound;