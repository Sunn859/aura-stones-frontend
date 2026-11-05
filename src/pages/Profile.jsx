import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Heart, Trash2 } from "lucide-react";
import mainApi from "../api/mainApi";
import useAuthStore from "../stores/authStore";

function Profile() {
  const storeUser = useAuthStore(
    (state) => state.user
  );

  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [profileResponse, favoriteResponse] =
          await Promise.all([
            mainApi.get("/auth/me"),
            mainApi.get("/favorites"),
          ]);

        setProfile(profileResponse.data.data);
        setFavorites(favoriteResponse.data.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "ไม่สามารถโหลดข้อมูลสมาชิกได้"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleDeleteFavorite(stoneId) {
    try {
      setDeletingId(stoneId);

      await mainApi.delete(
        `/favorites/${stoneId}`
      );

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (favorite) =>
            favorite.stoneId !== stoneId
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "ไม่สามารถลบรายการโปรดได้"
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF6EF]">
        <span className="loading loading-spinner loading-lg text-[#3D1648]" />
      </main>
    );
  }

  const displayedUser = profile || storeUser;

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-6 py-12">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-[#3D1648]">
          ข้อมูลสมาชิก
        </h1>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-500">
            {error}
          </div>
        )}

        {/* ข้อมูลผู้ใช้ */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-[#E5D2AB] bg-[#FCF8F1] shadow-lg">
          <div className="h-24 bg-gradient-to-r from-[#3D1648] to-[#54205F]" />

          <div className="px-8 pb-8">
            <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#FCF8F1] bg-[#D5A94E] text-4xl font-bold text-[#3D1648]">
              {displayedUser?.name
                ?.charAt(0)
                .toUpperCase() || "U"}
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#3D1648]">
              {displayedUser?.name}
            </h2>

            <p className="mt-1 text-gray-600">
              {displayedUser?.email}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#E5D2AB] p-4">
                <p className="text-sm text-gray-500">
                  สถานะสมาชิก
                </p>

                <p className="mt-1 font-semibold text-[#3D1648]">
                  {displayedUser?.role}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5D2AB] p-4">
                <p className="text-sm text-gray-500">
                  วันเกิด
                </p>

                <p className="mt-1 font-semibold text-[#3D1648]">
                  {displayedUser?.birthDate
                    ? new Date(
                        displayedUser.birthDate
                      ).toLocaleDateString(
                        "th-TH",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "ยังไม่ได้เพิ่มวันเกิด"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite */}
        <div className="mt-12 flex items-center gap-3">
          <Heart
            size={28}
            fill="currentColor"
            className="text-red-500"
          />

          <h2 className="text-3xl font-bold text-[#3D1648]">
            หินรายการโปรด
          </h2>
        </div>

        <p className="mt-2 text-gray-500">
          รายการโปรดทั้งหมด {favorites.length} รายการ
        </p>

        {favorites.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#E5D2AB] bg-[#FCF8F1] p-12 text-center">
            <Heart
              size={50}
              className="mx-auto text-[#D5A94E]"
            />

            <h3 className="mt-4 text-xl font-bold text-[#3D1648]">
              ยังไม่มีหินในรายการโปรด
            </h3>

            <p className="mt-2 text-gray-500">
              เลือกหินที่สนใจแล้วกดปุ่มหัวใจ
            </p>

            <Link
              to="/stones"
              className="mt-6 inline-block rounded-xl bg-[#3D1648] px-6 py-3 font-semibold text-white hover:bg-[#54205F]"
            >
              ดูหินทั้งหมด
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <article
                key={favorite.stoneId}
                className="overflow-hidden rounded-3xl border border-[#E5D2AB] bg-[#FCF8F1] shadow-md"
              >
                <Link
                  to={`/stones/${favorite.stone.id}`}
                >
                  <div className="h-56 overflow-hidden bg-[#EFE5D8]">
                    <img
                      src={favorite.stone.imageUrl}
                      alt={favorite.stone.nameTH}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/stones/${favorite.stone.id}`}
                      >
                        <h3 className="text-2xl font-bold text-[#3D1648] hover:text-[#D5A94E]">
                          {favorite.stone.nameTH}
                        </h3>
                      </Link>

                      <p className="text-sm text-[#A47A32]">
                        {favorite.stone.nameEN}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteFavorite(
                          favorite.stoneId
                        )
                      }
                      disabled={
                        deletingId === favorite.stoneId
                      }
                      title="ลบออกจากรายการโปรด"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-200 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId ===
                      favorite.stoneId ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        <Trash2 size={19} />
                      )}
                    </button>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">
                    {favorite.stone.benefit}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Profile;