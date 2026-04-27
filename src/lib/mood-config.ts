export interface MoodOption {
  emoji: string
  label: string
  color: string
}

export const MOOD_OPTIONS: MoodOption[] = [
  { emoji: '🥰', label: 'Yêu đời',    color: '#F7D6DF' },
  { emoji: '😊', label: 'Vui vẻ',     color: '#D8EDE5' },
  { emoji: '😌', label: 'Bình yên',   color: '#EDE8F5' },
  { emoji: '😴', label: 'Mệt mỏi',   color: '#E8E8E0' },
  { emoji: '🌧',  label: 'Buồn',       color: '#C8D8E8' },
  { emoji: '😤', label: 'Bực bội',   color: '#F5D0D0' },
  { emoji: '🤩', label: 'Hứng khởi', color: '#FFF0C0' },
  { emoji: '🫂', label: 'Cần ôm',    color: '#F0D8F0' },
]

export const getMoodByEmoji = (emoji: string): MoodOption | undefined =>
  MOOD_OPTIONS.find(m => m.emoji === emoji)

export const getMoodColor = (emoji: string): string =>
  getMoodByEmoji(emoji)?.color ?? '#F5F5F5'
