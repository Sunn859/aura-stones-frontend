import { useState } from "react";
import { Link } from "react-router";
import mainApi from "../api/mainApi";

const dayNames = {
  SUNDAY: "วันอาทิตย์",
  MONDAY: "วันจันทร์",
  TUESDAY: "วันอังคาร",
  WEDNESDAY: "วันพุธ",
  THURSDAY: "วันพฤหัสบดี",
  FRIDAY: "วันศุกร์",
  SATURDAY: "วันเสาร์",
};

function BirthMatch() {
  const [birthDate, setBirthDate] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // สร้างวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
  const today = new Date();
console.log(today)
  const maxBirthDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
console.log(maxBirthDate)
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!birthDate) {
      setError("กรุณาเลือกวันเกิด");
      return;
    }

    if (birthDate > maxBirthDate) {
      setError("วันเกิดต้องไม่เป็นวันที่ในอนาคต");
      return;
    }

    try {
      setIsLoading(true);
      setMatchResult(null);

      // อัปเดตวันเกิดของผู้ใช้ในฐานข้อมูล
      await mainApi.patch("/auth/me", {
        birthDate: birthDate,
      });

      // ขอผลแนะนำหินตามวันเกิด
      const response = await mainApi.get("/birthmatch");

      setMatchResult(response.data.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "ไม่สามารถค้นหาหินที่เหมาะกับคุณได้"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-6 py-12">
      <section className="mx-auto max-w-6xl">
        {/* หัวข้อ */}
        <div className="text-center">
          <p className="font-semibold tracking-[0.2em] text-[#D5A94E]">
            ✦ BIRTH STONE MATCH ✦
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#3D1648]">
            ค้นหาหินที่เหมาะกับคุณ
          </h1>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
            เลือกวันเดือนปีเกิด เพื่อค้นหาหินมงคล
            ที่เหมาะกับวันประจำสัปดาห์ของคุณ
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* แบบฟอร์มวันเกิด */}
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-3xl border border-[#E5D2AB] bg-[#FCF8F1] p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[#3D1648]">
              วันเกิดของคุณ
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              ระบบจะตรวจสอบวันในสัปดาห์
              และค้นหาหินที่ตรงกับวันเกิดของคุณ
            </p>

            <label
              htmlFor="birthDate"
              className="mt-6 block text-sm font-semibold text-[#3D1648]"
            >
              เลือกวันเดือนปีเกิด
            </label>

            <input
              id="birthDate"
              type="date"
              value={birthDate}
              max={maxBirthDate}
              onChange={(event) =>
                setBirthDate(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-[#D5A94E] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#3D1648]"
            />

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-xl bg-[#3D1648] px-6 py-3 font-semibold text-white transition hover:bg-[#54205F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "กำลังค้นหา..."
                : "ค้นหาหินที่เหมาะกับคุณ ✦"}
            </button>
          </form>

          {/* ผลลัพธ์ */}
          <div className="rounded-3xl border border-[#E5D2AB] bg-[#FCF8F1] p-8 shadow-lg">
            {!matchResult ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="text-7xl text-[#D5A94E]">
                  ✦
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#3D1648]">
                  รอค้นหาหินของคุณ
                </h2>

                <p className="mt-2 text-gray-500">
                  เลือกวันเกิดแล้วกดปุ่มค้นหา
                </p>
              </div>
            ) : (
              <div>
                {/* ข้อมูลวันเกิด */}
                <div className="text-center">
                  <p className="text-gray-500">
                    วันประจำสัปดาห์ของคุณคือ
                  </p>

                  <h2 className="mt-2 text-4xl font-bold text-[#D5A94E]">
                    {dayNames[matchResult.dayOfWeek] ||
                      matchResult.dayOfWeek}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    วันเกิด:{" "}
                    {new Date(
                      matchResult.birthDate
                    ).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="my-8 h-px bg-[#E5D2AB]" />

                <h3 className="mb-5 text-xl font-bold text-[#3D1648]">
                  หินที่เหมาะกับคุณ
                </h3>

                {!matchResult.stones ||
                matchResult.stones.length === 0 ? (
                  <p className="rounded-xl bg-[#FAF6EF] p-6 text-center text-gray-500">
                    ยังไม่มีหินที่กำหนดไว้สำหรับวันนี้
                  </p>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {matchResult.stones.map((stone) => (
                      <Link
                        key={stone.id}
                        to={`/stones/${stone.id}`}
                        className="overflow-hidden rounded-2xl border border-[#E5D2AB] bg-white transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        {stone.imageUrl ? (
                          <img
                            src={stone.imageUrl}
                            alt={stone.nameTH}
                            className="h-52 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-52 items-center justify-center bg-[#EFE5D8] text-gray-400">
                            ยังไม่มีรูปภาพ
                          </div>
                        )}

                        <div className="p-5">
                          {/* หมวดหมู่ */}
                          <div className="mb-3 flex flex-wrap gap-2">
                            {stone.stoneCategories?.length >
                            0 ? (
                              stone.stoneCategories.map(
                                (item) => (
                                  <span
                                    key={
                                      item.category.id
                                    }
                                    className="rounded-full bg-[#F4E8D1] px-3 py-1 text-xs font-semibold text-[#A47A32]"
                                  >
                                    {
                                      item.category
                                        .name
                                    }
                                  </span>
                                )
                              )
                            ) : (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                                ยังไม่ได้ระบุหมวดหมู่
                              </span>
                            )}
                          </div>

                          <h4 className="text-xl font-bold text-[#3D1648]">
                            {stone.nameTH}
                          </h4>

                          <p className="text-sm text-[#A47A32]">
                            {stone.nameEN}
                          </p>

                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                            {stone.benefit}
                          </p>

                          <p className="mt-4 text-sm font-semibold text-[#3D1648]">
                            ดูรายละเอียด →
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default BirthMatch;