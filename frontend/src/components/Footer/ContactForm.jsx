export default function ContactForm() {
  return (
    <div>
      <div className="flex gap-4 mb-4">
        <h2 className="text-2xl font-semibold text-white">Drop us a line</h2>
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-purple-600 rounded-lg rotate-12" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          </div>
        </div>
      </div>

      <form className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 border-2 border-white focus:outline-none focus:border-purple-400"
          required
        />
        <textarea
          placeholder="Message"
          rows={6}
          className="w-full p-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 border-2 border-white focus:outline-none focus:border-purple-400 resize-none"
          required
        />
        <button
          type="submit"
          className="bg-[#0072bb] hover:bg-[#0072bb] text-black px-8 py-3 rounded-full font-medium transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  )
}

