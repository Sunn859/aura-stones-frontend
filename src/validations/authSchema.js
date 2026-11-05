import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),

    email: z
      .string()
      .trim()
      .min(1, "กรุณากรอกอีเมล")
      .email("รูปแบบอีเมลไม่ถูกต้อง"),

    password: z
      .string()
      .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),

    confirmPassword: z
      .string()
      .min(1, "กรุณายืนยันรหัสผ่าน"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "รหัสผ่านไม่ตรงกัน",
      path: ["confirmPassword"],
    }
  );


  export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง"),

  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน"),
});