import { useState } from "react";
import { useNavigate } from "react-router";

import mainApi from "../api/mainApi";
import { loginSchema } from "../validations/authSchema";
import useAuthStore from "../stores/authStore";

const initialForm = {
  email: "",
  password: "",
};

function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

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

    const result = loginSchema.safeParse(form);

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

      const response = await mainApi.post(
        "/auth/login",
        result.data
      );

      const { user, token } = response.data.data;

      setAuth(user, token);

      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "ไม่สามารถเข้าสู่ระบบได้"
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
        <h1 className="text-3xl font-bold text-[#3D1648]">
          เข้าสู่ระบบ
        </h1>

        <p className="mt-2 text-[#756A70]">
          กลับมาค้นพบหินที่เหมาะกับคุณ
        </p>
      </div>

      {message && (
        <div className="alert alert-error">
          <span>{message}</span>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">
          อีเมล
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          className="input w-full"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email}
          </p>
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
          placeholder="กรอกรหัสผ่าน"
          className="input w-full"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn w-full border-[#D5A94E] bg-[#3D1648] text-white hover:bg-[#54205F]"
      >
        {isLoading ? (
          <span className="loading loading-spinner" />
        ) : (
          "เข้าสู่ระบบ"
        )}
      </button>

      <p className="text-center text-sm">
        ยังไม่มีบัญชี?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-semibold text-[#54205F]"
        >
          สมัครสมาชิก
        </button>
      </p>
    </form>
  );
}

export default LoginForm;