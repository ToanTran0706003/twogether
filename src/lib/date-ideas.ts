export type CostType = "free" | "under200k" | "under500k" | "any"
export type LocationType = "home" | "outdoor" | "both"

export interface DateIdea {
  emoji: string
  title: string
  description: string
  duration: string
  cost: CostType
  location: LocationType
}

export const DATE_IDEAS: DateIdea[] = [
  {
    emoji: "🎬",
    title: "Xem phim",
    description: "Chọn phim từ watchlist chung, làm bắp rang bơ và thưởng thức",
    duration: "2-3 tiếng",
    cost: "under200k",
    location: "home",
  },
  {
    emoji: "🍳",
    title: "Nấu bữa tối cùng nhau",
    description: "Cùng vào bếp, nấu một món mới chưa từng thử",
    duration: "1-2 tiếng",
    cost: "under200k",
    location: "home",
  },
  {
    emoji: "🌅",
    title: "Đi xem hoàng hôn",
    description: "Ra bờ sông, biển hoặc đồi cao, mang theo đồ ăn nhẹ",
    duration: "1-2 tiếng",
    cost: "free",
    location: "outdoor",
  },
  {
    emoji: "☕",
    title: "Cà phê sáng sớm",
    description: "Dậy sớm, ra quán cà phê yêu thích trước giờ mở cửa",
    duration: "30 phút - 1 tiếng",
    cost: "under200k",
    location: "outdoor",
  },
  {
    emoji: "🛒",
    title: "Market run",
    description: "Đi chợ hoặc siêu thị, chọn nguyên liệu và nấu bữa trưa cùng nhau",
    duration: "1-2 tiếng",
    cost: "under200k",
    location: "both",
  },
  {
    emoji: "🚶",
    title: "Dạo phố",
    description: "Đi bộ không cần đích, rẽ vào quán xá, ngõ hẻm bất kỳ",
    duration: "1-2 tiếng",
    cost: "free",
    location: "outdoor",
  },
  {
    emoji: "🎮",
    title: "Game night",
    description: "Board game, card game hoặc game console — thua phải chịu phạt",
    duration: "1-2 tiếng",
    cost: "free",
    location: "home",
  },
  {
    emoji: "🌿",
    title: "Picnic trong công viên",
    description: "Chuẩn bị đồ ăn nhẹ, gối, nhạc — nằm dưới gốc cây",
    duration: "2-3 tiếng",
    cost: "free",
    location: "outdoor",
  },
  {
    emoji: "🎵",
    title: "Karaoke",
    description: "Hát hết mình những bài hát của nhau, có thể hát duet",
    duration: "2-3 tiếng",
    cost: "under200k",
    location: "outdoor",
  },
  {
    emoji: "📖",
    title: "Đọc sách cùng nhau",
    description: "Mỗi người đọc một chương, thảo luận về nội dung",
    duration: "1-2 tiếng",
    cost: "free",
    location: "home",
  },
  {
    emoji: "🧘",
    title: "Yoga / Thiền buổi sáng",
    description: "Cùng tập yoga, stretching hoặc thiền 10 phút mỗi sáng",
    duration: "30 phút",
    cost: "free",
    location: "home",
  },
  {
    emoji: "🛁",
    title: "Spa day tại nhà",
    description: "Đắp mặt nạ, sơn móng, massage cho nhau",
    duration: "1-2 tiếng",
    cost: "free",
    location: "home",
  },
  {
    emoji: "🚲",
    title: "Đạp xe",
    description: "Thuê xe đạp, đi theo tuyến đường mới — mang theo camera",
    duration: "2-3 tiếng",
    cost: "under200k",
    location: "outdoor",
  },
  {
    emoji: "🎨",
    title: "Vẽ tranh",
    description: "Mỗi người vẽ chân dung người kia, không cần giỏi",
    duration: "1-2 tiếng",
    cost: "under200k",
    location: "home",
  },
  {
    emoji: "🌊",
    title: "Đi biển",
    description: "Tắm biển, xây sandcastle, ăn hải sản và ngắm sao trời",
    duration: "Nửa ngày",
    cost: "any",
    location: "outdoor",
  },
  {
    emoji: "📸",
    title: "Photo walk",
    description: "Mang theo máy ảnh hoặc điện thoại, chụp ảnh cho nhau ở góc phố mới",
    duration: "1-2 tiếng",
    cost: "free",
    location: "outdoor",
  },
  {
    emoji: "🍜",
    title: "Food tour",
    description: "Thử 3-5 món ăn đường phố mà chưa từng ăn, đi bộ giữa các quán",
    duration: "2-3 tiếng",
    cost: "under200k",
    location: "outdoor",
  },
  {
    emoji: "🎬",
    title: "Làm video ngắn",
    description: "Quay một video TikTok/Reel ngộ nghĩnh về cuộc sống của hai người",
    duration: "30 phút - 1 tiếng",
    cost: "free",
    location: "both",
  },
  {
    emoji: "☕",
    title: "Thử quán mới",
    description: "Tìm một quán cà phê hoặc trà sữa chưa từng đặt chân vào",
    duration: "1-2 tiếng",
    cost: "under200k",
    location: "outdoor",
  },
  {
    emoji: "🌱",
    title: "Trồng cây",
    description: "Mua cây con hoặc gieo hạt, chăm sóc và đặt tên cho nó",
    duration: "1-2 tiếng",
    cost: "under200k",
    location: "home",
  },
  {
    emoji: "📝",
    title: "Viết thư tay",
    description: "Ngồi xuống viết những điều chưa nói, trao đổi sau khi viết xong",
    duration: "1-2 tiếng",
    cost: "free",
    location: "home",
  },
  {
    emoji: "🧩",
    title: "Puzzle",
    description: "Chọn một puzzle 500-1000 mảnh, cùng lắp rồi đóng khung treo tường",
    duration: "2-3 tiếng",
    cost: "under200k",
    location: "home",
  },
  {
    emoji: "🎲",
    title: "Cùng học một điều mới",
    description: "Chọn một kỹ năng: nấu ăn, nhảy, guitar — cùng học từ YouTube",
    duration: "1-2 tiếng",
    cost: "free",
    location: "home",
  },
  {
    emoji: "🏕️",
    title: "Cắm trại trong nhà",
    description: "Dựng lều hoặc blanket fort, kể chuyện ma, ăn snack",
    duration: "2-3 tiếng",
    cost: "free",
    location: "home",
  },
  {
    emoji: "🛍️",
    title: "Window shopping",
    description: "Đi các trung tâm thương mại, chỉ ngắm không mua, thử đồ",
    duration: "2-3 tiếng",
    cost: "free",
    location: "outdoor",
  },
  {
    emoji: "🌄",
    title: "Leo núi ngắm bình minh",
    description: "Chọn đỉnh núi gần, mang theo bánh mì và nước, chụp ảnh đỉnh núi",
    duration: "Nửa ngày",
    cost: "free",
    location: "outdoor",
  },
  {
    emoji: "🎤",
    title: "Hát karaoke",
    description: "Thuê phòng karaoke, hát những bài hát gắn liền với kỷ niệm",
    duration: "2-3 tiếng",
    cost: "under200k",
    location: "outdoor",
  },
  {
    emoji: "🥗",
    title: "Nấu ăn healthy",
    description: "Chọn một công thức eat-clean, nấu và thưởng thức cùng nhau",
    duration: "1-2 tiếng",
    cost: "under200k",
    location: "home",
  },
  {
    emoji: "🎭",
    title: "Xem show / ca nhạc",
    description: "Tìm vé xem liveshow, kịch, hoặc comedy show gần đây",
    duration: "Nửa ngày",
    cost: "any",
    location: "outdoor",
  },
  {
    emoji: "🫂",
    title: "Ngày nghỉ ngơi",
    description: "Không làm gì cả — nằm xem phim, ăn uống, ngủ nướng",
    duration: "Nửa ngày",
    cost: "free",
    location: "home",
  },
  {
    emoji: "🧪",
    title: "Thí nghiệm nấu ăn",
    description: "Chọn một món ăn lạ từ nước ngoài, nấu thử cùng nhau",
    duration: "1-2 tiếng",
    cost: "under200k",
    location: "home",
  },
  {
    emoji: "🚤",
    title: "Chèo thuyền / kayak",
    description: "Thuê thuyền hoặc kayak, khám phá sông nước gần thành phố",
    duration: "Nửa ngày",
    cost: "under500k",
    location: "outdoor",
  },
  {
    emoji: "🍰",
    title: "Làm bánh",
    description: "Chọn một loại bánh yêu thích, làm từ đầu — ăn khi còn ấm",
    duration: "1-2 tiếng",
    cost: "under200k",
    location: "home",
  },
]

export function filterIdeas(
  ideas: DateIdea[],
  options: {
    cost?: CostType | null
    location?: LocationType | null
    duration?: string | null
  }
): DateIdea[] {
  return ideas.filter((idea) => {
    if (options.cost && idea.cost !== options.cost && idea.cost !== "any") return false
    if (options.location) {
      if (idea.location !== options.location && idea.location !== "both") return false
    }
    if (options.duration) {
      const dur = options.duration
      if (dur === "short" && idea.duration !== "30 phút" && !idea.duration.startsWith("30")) return false
      if (dur === "medium" && !idea.duration.includes("1-2") && !idea.duration.includes("2-3")) return false
      if (dur === "long" && idea.duration !== "Nửa ngày") return false
    }
    return true
  })
}

export function pickRandomIdea(ideas: DateIdea[]): DateIdea | null {
  if (ideas.length === 0) return null
  return ideas[Math.floor(Math.random() * ideas.length)]
}
