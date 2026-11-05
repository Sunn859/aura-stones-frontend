import { useEffect, useState } from "react";
import {Link,useNavigate,useParams,} from "react-router";
import { Heart } from "lucide-react";
import mainApi from "../api/mainApi";
import useAuthStore from "../stores/authStore";

function StoneDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);

  const [stone, setStone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFavorite, setIsFavorite] =useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] =useState(false);
  const [favoriteMessage, setFavoriteMessage] =useState("");

  // // เก็บข้อความผลลัพธ์จากการเพิ่มหรือลบ Favorite เช่น "เพิ่มในรายการโปรดแล้ว"

  // ดึงรายละเอียดหิน
  useEffect(() => {
    async function fetchStone() {
      try {
        const response = await mainApi.get(
          `/stones/${id}`
        );

        setStone(response.data.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "ไม่สามารถโหลดข้อมูลหินได้"
        );
      } finally {
        setIsLoading(false);
      }
    }

     // เรียกฟังก์ชันให้เริ่มดึงข้อมูล ถ้าไม่ใส่ () ฟังก์ชันจะถูกประกาศไว้แต่ยังไม่ทำงาน
    fetchStone();
  }, [id]);

  // ตรวจว่าหินก้อนนี้อยู่ใน Favorite หรือยัง
  useEffect(() => {
    async function checkFavorite() {
      if (!token) {
        setIsFavorite(false);
        return;
      }

      try {
        const response =
          await mainApi.get("/favorites");

        const favorites = response.data.data;

        const foundFavorite = favorites.some((favorite) => favorite.stoneId === Number(id)
        );

         // เก็บผล true หรือ false ลงใน State React จะนำค่าไปเปลี่ยนหน้าตาปุ่มหัวใจ
        setIsFavorite(foundFavorite);
      } catch (error) {
        console.error(
          "ตรวจสอบ Favorite ไม่สำเร็จ",
          error
        );
      }
    }

    checkFavorite();
  }, [id, token]);

  // เพิ่มหรือลบ Favorite
  async function handleFavorite() {
    if (!token) {
      navigate("/login");
      return;
    }

    try {

      setIsFavoriteLoading(true);
       // บอกระบบว่ากำลังส่ง Request Favorite
      setFavoriteMessage("");
       // ล้างข้อความจากการกดครั้งก่อน

      if (isFavorite) {
        await mainApi.delete(`/favorites/${id}`);
        //ตรวจว่าหินอยู่ใน Favorite แล้วมั้ย ถ้าอยู่แล้วลบได้

        setIsFavorite(false);
        setFavoriteMessage(
          "นำออกจากรายการโปรดแล้ว"
        );
      } else {
        await mainApi.post(`/favorites/${id}`);

        setIsFavorite(true);
        setFavoriteMessage(
          "เพิ่มในรายการโปรดแล้ว"
        );
      }
    } catch (error) {
      console.error(error);

      setFavoriteMessage(
        error.response?.data?.message ||
          "ไม่สามารถแก้ไขรายการโปรดได้"
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF6EF]">
        <span className="loading loading-spinner loading-lg text-[#3D1648]" />
      </main>
    );
  }

  if (error || !stone) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF6EF]">
        <p className="text-red-500">
          {error || "ไม่พบข้อมูลหิน"}
        </p>

        <Link
          to="/stones"
          className="text-[#3D1648] underline"
        >
          กลับไปหน้าหินทั้งหมด
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-6 py-12">
      <section className="mx-auto max-w-6xl">
        <Link
          to="/stones"
          className="mb-8 inline-block text-[#3D1648] hover:text-[#D5A94E]"
        >
          ← กลับไปหน้าหินทั้งหมด
        </Link>

        <div className="grid overflow-hidden rounded-3xl border border-[#E5D2AB] bg-[#FCF8F1] shadow-xl md:grid-cols-2">
          {/* รูปหิน */}
          <div className="bg-[#EFE5D8]">
            {stone.imageUrl ? (
              <img
                src={stone.imageUrl}
                alt={stone.nameTH}
                className="h-full min-h-[450px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[450px] items-center justify-center text-gray-400">
                ยังไม่มีรูปภาพ
              </div>
            )}
          </div>

          {/* ข้อมูลหิน */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#D5A94E]">
              AURA STONE
            </p>

            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-[#3D1648]">
                  {stone.nameTH}
                </h1>

                <p className="mt-1 text-xl text-[#A47A32]">
                  {stone.nameEN}
                </p>
              </div>

              {/* ปุ่ม Favorite */}
              <button
                type="button"
                onClick={handleFavorite}
                disabled={isFavoriteLoading}
                title={
                  isFavorite
                    ? "นำออกจากรายการโปรด"
                    : "เพิ่มในรายการโปรด"
                }
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition ${
                  isFavorite
                    ? "border-red-400 bg-red-50 text-red-500"
                    : "border-[#D5A94E] bg-white text-[#3D1648] hover:bg-[#F4E8D1]"
                }`}
              >
                {isFavoriteLoading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <Heart
                    size={24}
                    fill={
                      isFavorite
                        ? "currentColor"
                        : "none"
                    }
                  />
                )}
              </button>
            </div>

            {favoriteMessage && (
              <p className="mt-4 rounded-xl bg-[#F4E8D1] px-4 py-3 text-sm text-[#3D1648]">
                {favoriteMessage}
              </p>
            )}

            <div className="my-6 h-px bg-[#E5D2AB]" />

            <h2 className="text-lg font-bold text-[#3D1648]">
              รายละเอียด
            </h2>

            <p className="mt-2 leading-7 text-gray-600">
              {stone.description}
            </p>

            <h2 className="mt-6 text-lg font-bold text-[#3D1648]">
              ความเชื่อและคุณประโยชน์
            </h2>

            <p className="mt-2 leading-7 text-gray-600">
              {stone.benefit}
            </p>

            <div className="mt-6 rounded-2xl border border-[#E5D2AB] p-4">
              <span className="font-semibold text-[#3D1648]">
                สีของหิน:
              </span>{" "}
              {stone.color}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default StoneDetail;