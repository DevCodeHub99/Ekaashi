import HomeContent from "@/components/home/HomeContent"

// Static page - no server-side data fetching
// Products load client-side for always-fresh data
export default function Home() {
  return <HomeContent />
}
