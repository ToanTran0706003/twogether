export interface MoodOption {
  emoji: string
  label: string
  color: string
  textColor: string
}

export const MOOD_OPTIONS: MoodOption[] = [
  { emoji: '🥰', label: 'Yêu đời',    color: '#F7D6DF', textColor: '#C0607A' },
  { emoji: '😊', label: 'Vui vẻ',     color: '#D8EDE5', textColor: '#2A6A55' },
  { emoji: '😌', label: 'Bình yên',   color: '#EDE8F5', textColor: '#534AB7' },
  { emoji: '😴', label: 'Mệt mỏi',   color: '#E8E8E0', textColor: '#5A5A52' },
  { emoji: '🌧',  label: 'Buồn',       color: '#C8D8E8', textColor: '#2A4A6A' },
  { emoji: '😤', label: 'Bực bội',   color: '#F5D0D0', textColor: '#A32D2D' },
  { emoji: '🤩', label: 'Hứng khởi', color: '#FFF0C0', textColor: '#854F0B' },
  { emoji: '🫂', label: 'Cần ôm',    color: '#F0D8F0', textColor: '#7A3A7A' },
]

export const getMoodByEmoji = (emoji: string): MoodOption | undefined =>
  MOOD_OPTIONS.find(m => m.emoji === emoji)

export const getMoodColor = (emoji: string): string =>
  getMoodByEmoji(emoji)?.color ?? '#F5F5F5'
