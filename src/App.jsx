import { RouterProvider } from "react-router";
import router from "./routes/AppRouter";

// RouterProvider ทำให้เว็บไซต์สามารถเลือกหน้าที่จะแสดงตาม URL ใน Browser ได้

function App() {
  return <RouterProvider router={router} />;
   
}

export default App;