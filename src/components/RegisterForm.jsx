import { useState } from "react";
import { useNavigate } from "react-router";

import mainApi from "../api/mainApi";
import { registerSchema } from "../validations/authSchema";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrors({});
    setMessage("");

    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);

      await mainApi.post("/auth/register", {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });

      navigate("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "ไม่สามารถสมัครสมาชิกได้"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-3xl border border-[#D5A94E] bg-[#FCF8F1] p-8 shadow-xl"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#3D1648]">สร้างบัญชี</h1>

        <p className="mt-2 text-[#756A70]">เริ่มต้นเส้นทางค้นหาหินของคุณ</p>
      </div>

      {message && (
        <div className="alert alert-error">
          <span>{message}</span>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">ชื่อ</label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="ชื่อของคุณ"
          className="input w-full"
        />

        {errors.name && (<p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">อีเมล</label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          className="input w-full"
        />

        {errors.email && (<p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          รหัสผ่าน
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="อย่างน้อย 6 ตัวอักษร"
          className="input w-full"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">ยืนยันรหัสผ่าน</label>

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="กรอกรหัสผ่านอีกครั้ง"
          className="input w-full"
        />

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn w-full border-[#D5A94E] bg-[#3D1648] text-white hover:bg-[#54205F]"
      >
        {isLoading
          ? <span className="loading loading-spinner" />
          : "สมัครสมาชิก"}
      </button>

      <p className="text-center text-sm">
        มีบัญชีแล้ว?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-semibold text-[#54205F]"
        >เข้าสู่ระบบ</button>
      </p>
    </form>
  );
}

export default RegisterForm;