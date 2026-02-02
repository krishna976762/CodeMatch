const ChatSkeleton = () => {
  return (
    <div className="mt-12 w-full max-w-3xl mx-auto h-[80vh] bg-[#0f0f14] rounded-2xl shadow-xl flex flex-col overflow-hidden border border-white/10 animate-pulse">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-[#14141d]">
        <div className="w-10 h-10 rounded-full bg-white/10" />
        <div className="flex flex-col gap-2">
          <div className="w-32 h-3 rounded bg-white/10" />
          <div className="w-20 h-2 rounded bg-white/10" />
        </div>
      </div>


      <div className="flex-1 overflow-hidden px-5 py-4 space-y-4">

        <div className="flex justify-start">
          <div className="w-52 h-10 rounded-2xl bg-white/10" />
        </div>

        <div className="flex justify-end">
          <div className="w-44 h-10 rounded-2xl bg-white/10" />
        </div>

        <div className="flex justify-start">
          <div className="w-64 h-12 rounded-2xl bg-white/10" />
        </div>

        <div className="flex justify-end">
          <div className="w-36 h-10 rounded-2xl bg-white/10" />
        </div>

        <div className="flex justify-start">
          <div className="w-48 h-10 rounded-2xl bg-white/10" />
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-[#14141d] flex items-center gap-3">
        <div className="flex-1 h-12 rounded-full bg-white/10" />
        <div className="w-20 h-12 rounded-full bg-white/10" />
      </div>
    </div>
  );
};

export default ChatSkeleton;
