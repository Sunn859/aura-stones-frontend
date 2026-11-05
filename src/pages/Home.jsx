import { useEffect, useState } from "react";
import { Link } from "react-router";
import mainApi from "../api/mainApi";

const categories = [
  {
    name: "ความรัก",
    description:
      "เสริมเสน่ห์ ความสัมพันธ์ และความรักที่ดี",
    icon: "♡",
  },
  {
    name: "การงาน",
    description:
      "เพิ่มความมั่นใจ ความก้าวหน้า และความสำเร็จ",
    icon: "▣",
  },
  {
    name: "การเงิน",
    description:
      "ดึงดูดโอกาส ความมั่งคั่ง และความมั่นคง",
    icon: "฿",
  },
  {
    name: "จิตใจ",
    description:
      "เสริมพลังชีวิต สมดุลกายใจ และความสงบ",
    icon: "♧",
  },
];

function Home() {
  const [recommendedStones, setRecommendedStones] =
    useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendedStones() {
      try {
        const response = await mainApi.get("/stones");

        const firstThreeStones =
          response.data.data.slice(0, 3);

        setRecommendedStones(firstThreeStones);
      } catch (error) {
        console.error(
          "โหลดหินแนะนำไม่สำเร็จ",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendedStones();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF6EF]">
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-br from-[#FCF8F1] via-[#FAF6EF] to-[#EEDFCF]">
        <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <p className="mb-4 font-semibold tracking-[0.25em] text-[#D5A94E]">
              AURA STONE
            </p>

            <h1 className="text-5xl font-bold leading-tight text-[#3D1648] md:text-6xl">
              ค้นพบหินที่
              <br />
              เหมาะกับคุณ
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              ทุกคนมีพลังงานที่เป็นเอกลักษณ์
              ค้นพบหินมงคลที่เหมาะกับวันเกิด
              และความต้องการของคุณ
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/birthmatch"
                className="rounded-xl bg-[#3D1648] px-8 py-4 font-semibold text-white transition hover:bg-[#54205F]"
              >
                เริ่มค้นหาหิน ✦
              </Link>

              <Link
                to="/stones"
                className="rounded-xl border border-[#D5A94E] px-8 py-4 font-semibold text-[#3D1648] transition hover:bg-[#F4E8D1]"
              >
                ดูหินทั้งหมด
              </Link>
            </div>
          </div>

          {/* รูปหินด้านขวา */}
          <div className="relative hidden min-h-[420px] lg:block">
            <div className="absolute right-12 top-0 h-72 w-72 rounded-full border border-[#D5A94E]" />

            <img
              src="/images/stones/07-amethyst.webp"
              alt="อเมทิสต์"
              className="absolute bottom-0 left-0 h-72 w-72 rounded-[3rem] object-cover shadow-2xl"
            />

            <img
              src="/images/stones/03-rose-quartz.webp"
              alt="โรสควอตซ์"
              className="absolute right-0 top-4 h-56 w-56 rounded-full border-4 border-[#FCF8F1] object-cover shadow-xl"
            />

            <img
              src="/images/stones/19-citrine.webp"
              alt="ซิทริน"
              className="absolute bottom-2 right-2 h-44 w-44 rounded-3xl border-4 border-[#FCF8F1] object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* หมวดหมู่ */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="font-semibold text-[#D5A94E]">
            ✦ เลือกตามความต้องการ ✦
          </p>

          <h2 className="mt-2 text-4xl font-bold text-[#3D1648]">
            คุณกำลังมองหาอะไร
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/stones?category=${encodeURIComponent(
                category.name
              )}`}
              className="rounded-2xl border border-[#E5D2AB] bg-[#FCF8F1] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl text-[#D5A94E]">
                {category.icon}
              </div>

              <h3 className="mt-4 text-xl font-bold text-[#3D1648]">
                {category.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* หินแนะนำ */}
      <section className="bg-[#F4E8D9] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-semibold text-[#D5A94E]">
                ✦ AURA COLLECTION
              </p>

              <h2 className="mt-2 text-4xl font-bold text-[#3D1648]">
                หินแนะนำ
              </h2>
            </div>

            <Link
              to="/stones"
              className="font-semibold text-[#3D1648] hover:text-[#D5A94E]"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="loading loading-spinner loading-lg text-[#3D1648]" />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {recommendedStones.map((stone) => (
                <Link
                  key={stone.id}
                  to={`/stones/${stone.id}`}
                  className="group overflow-hidden rounded-3xl bg-[#FCF8F1] shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-72 overflow-hidden bg-[#EFE5D8]">
                    {stone.imageUrl ? (
                      <img
                        src={stone.imageUrl}
                        alt={stone.nameTH}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        ยังไม่มีรูปภาพ
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#3D1648]">
                      {stone.nameTH}
                    </h3>

                    <p className="text-sm text-[#A47A32]">
                      {stone.nameEN}
                    </p>

                    <p className="mt-3 line-clamp-2 text-gray-600">
                      {stone.benefit}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;