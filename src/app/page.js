
export default function Home() {
  return (
    <div >
      <div className=" h-10" >
        <h1 className="mt-5">Log in/Log out Authentication System</h1>
       </div>
       
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-pink-700 mb-6">
            Welcome to Our Authentication System
          </h2>
          <p className="text-center text-pink-600">
            Please <a href="/register"> register </a>
             or <a href="/login"> login </a> to continue.
          </p>
          </div>  
          </div>
    </div>
  );
}
