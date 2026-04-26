import TopNav from "@/components/shared/TopNav"
import SpinnerClient from "@/components/spinner/SpinnerClient"

export default function SpinnerPage() {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#FDF8F5" }}>
      <TopNav />

      <div className="px-4 pt-4">
        <h1 className="font-serif text-2xl font-bold mb-1" style={{ color: "#C0607A" }}>
          Date Spinner
        </h1>
        <p className="text-sm mb-4" style={{ color: "#8A6A72" }}>
          Quay vòng để chọn gợi ý hẹn hò cho hai ta ♡
        </p>
      </div>

      <SpinnerClient />
    </div>
  )
}
