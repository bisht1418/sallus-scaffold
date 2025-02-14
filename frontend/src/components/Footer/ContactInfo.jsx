import { MapPin, Phone, Mail } from "lucide-react"

export default function ContactInfo() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-8">Contacts</h2>
      <div className="bg-white rounded-2xl p-6 space-y-6 mb-8">
        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 text-purple-700 mt-1" />
          <p className="text-gray-700">4517 Washington Ave, Manchester, Kentucky 39495</p>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-purple-700" />
          <p className="text-gray-700">(+47)902-324-08</p>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-purple-700" />
          <p className="text-gray-700">Support@salusscaffold.com</p>
        </div>
      </div>
      <button className="bg-[#0072bb] hover:bg-[#0073bb6a] text-white px-8 py-3 rounded-full font-medium transition-colors">
        Contact us
      </button>
    </div>
  )
}

