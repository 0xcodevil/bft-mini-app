import { useNavigate } from "react-router-dom";
import { initDataStartParam, initDataRaw } from "@telegram-apps/sdk-react";
import { API, apiErrorHandler } from "@/libs/API";

const IndexPage = () => {
  const navigate = useNavigate();
  const raw = initDataRaw();
  const startParam = initDataStartParam();

  const handleEnter = () => {
    API.post('/auth/login', {
      data: raw,
      inviterId: startParam,
    }).then(() => {
      navigate('/home');
    }).catch(apiErrorHandler);
  }

  return (
    <>
      <div className="absolute inset-0 bg-[url('/imgs/background.jpg')] bg-cover bg-center" />
      <div className="relative bg-gradient-to-b from-white/30 to-black/30">
        <div className="max-w-md mx-auto px-4 flex flex-col justify-around min-h-screen">
          <div className="space-y-2">
            <h1 className="text-white text-4xl font-bold text-center">Big Five Match</h1>
            <p className="text-white text-center">African wildlife adventure</p>
          </div>
          <div className="text-4xl flex justify-center">
            <div className="animate-bounce">🦁</div>
            <div className="animate-bounce" style={{ animationDelay: '.1s' }}>🐘</div>
            <div className="animate-bounce" style={{ animationDelay: '.2s' }}>🐆</div>
            <div className="animate-bounce" style={{ animationDelay: '.3s' }}>🦏</div>
            <div className="animate-bounce" style={{ animationDelay: '.4s' }}>🐃</div>
          </div>
          <div className="">
            <button onClick={handleEnter} className="w-full flex items-center justify-center py-2 rounded-xl text-white text-lg font-semibold bg-primary cursor-pointer hover:opacity-90 transition-opacity">Login</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default IndexPage;