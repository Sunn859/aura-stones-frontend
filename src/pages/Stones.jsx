import { useEffect, useState } from "react";
import {Link,useSearchParams,} from "react-router";
import mainApi from "../api/mainApi";

function Stones() {
  const [stones, setStones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "ทั้งหมด";

  useEffect(() => {
    async function fetchStones() {
      try {
        const response = await mainApi.get("/stones");

        setStones(response.data.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "ไม่สามารถโหลดข้อมูลหินได้"
        );
      } finally {
        setIsLoading(false);
        // กำลังขอข้อมูล → isLoading = true , ขอสำเร็จ → isLoading = false และมี stones , ขอไม่สำเร็จ ได้ error
      }
    }

    fetchStones();
    // เรียกฟังชั่น
  }, []);

  const categories = [
    "ทั้งหมด",
    "ความรัก",
    "การงาน",
    "การเงิน",
    "จิตใจ",
  ];

  const filteredStones =
    selectedCategory === "ทั้งหมด"
      ? stones
      : stones.filter((stone) =>
          stone.stoneCategories.some(
            (item) =>
              item.category.name === selectedCategory
            
            //ถ้าหมวดที่ผู้ใช้เลือกคือ “ทั้งหมด” ให้ใช้รายการหินทั้งหมด
            //แต่ถ้าไม่ใช่ ให้กรองรายการหิน โดยเก็บเฉพาะหินที่มีอย่างน้อยหนึ่งหมวด
          )
        );

  function handleCategoryChange(category) {
    if (category === "ทั้งหมด") {
      setSearchParams({});
    } else {
      setSearchParams({
        category: category,
      });
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF6EF]">
        <span className="loading loading-spinner loading-lg text-[#3D1648]" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF6EF]">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-6 py-12">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#3D1648]">
            หินทั้งหมด
          </h1>

          <p className="mt-2 text-gray-600">
            ค้นพบหินมงคลและความหมายที่เหมาะกับคุณ
          </p>
        </div>

        {/* ปุ่มกรองหมวดหมู่ */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                handleCategoryChange(category)
              }
              className={`rounded-xl border px-5 py-3 font-medium transition ${
                selectedCategory === category
                  ? "border-[#3D1648] bg-[#3D1648] text-white"
                  : "border-[#D5A94E] bg-[#FCF8F1] text-[#3D1648] hover:bg-[#F4E8D1]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="mb-5 text-sm text-gray-500">
          พบหินทั้งหมด {filteredStones.length} รายการ
        </p>

        {filteredStones.length === 0 ? (
          <div className="rounded-2xl border border-[#E5D2AB] bg-[#FCF8F1] p-10 text-center text-gray-500">
            ไม่พบหินในหมวดหมู่นี้
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStones.map((stone) => (
              <Link
                key={stone.id}
                to={`/stones/${stone.id}`}
                className="overflow-hidden rounded-3xl border border-[#E5D2AB] bg-[#FCF8F1] shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-64 bg-[#EFE5D8]">
                  {stone.imageUrl ? (
                    <img
                      src={stone.imageUrl}
                      alt={stone.nameTH}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      ยังไม่มีรูปภาพ
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* หมวดหมู่ของหิน */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {stone.stoneCategories.map(
                      (item) => (
                        <span
                          key={item.category.id}
                          className="rounded-full bg-[#F4E8D1] px-3 py-1 text-xs font-semibold text-[#A47A32]"
                        >
                          {item.category.name}
                        </span>
                      )
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-[#3D1648]">
                    {stone.nameTH}
                  </h2>

                  <p className="text-sm text-[#A47A32]">
                    {stone.nameEN}
                  </p>

                  <p className="mt-3 line-clamp-2 text-gray-600">
                    {stone.description}
                  </p>

                  <p className="mt-4 text-sm">
                    สี: {stone.color}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Stones;