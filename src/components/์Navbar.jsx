import { Link, useNavigate } from "react-router";
import useAuthStore from "../stores/authStore";

function Navbar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
    // อ่านข้อมูล user จาก authStore state คือข้อมูลทั้งหมดที่อยู่ใน Store state.user คือเลือกมาเฉพาะข้อมูลผู้ใช้

  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout
  );

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-[#3D1648] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-[#D5A94E]">AURA STONE</Link>

        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="hover:text-[#D5A94E]"> หน้าแรก</Link>

          <Link
            to="/stones"
            className="hover:text-[#D5A94E]">หินทั้งหมด</Link>

          <Link
            to="/birthmatch"
            className="hover:text-[#D5A94E]">หินที่เหมาะกับคุณ</Link>

          {token ? (
            <>
              <Link
                to="/profile"
                className="hover:text-[#D5A94E]">
                โปรไฟล์
              </Link>

              <span className="text-sm text-[#F4E3BC]">
                สวัสดี {user?.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="btn border-[#D5A94E] bg-transparent text-white hover:bg-[#D5A94E] hover:text-[#3D1648]"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-[#D5A94E]"
              >
                เข้าสู่ระบบ
              </Link>

              <Link
                to="/register"
                className="btn border-[#D5A94E] bg-[#D5A94E] text-[#3D1648]"
              >
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;