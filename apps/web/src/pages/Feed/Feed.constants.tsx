export const feelCat = ['전체', '지치고 무기력해', '답답하고 환기가 필요해', '괜찮아, 가볍게 즐기고 싶어'];
export const bodyStateCat = ['전체', '잠깐 (1시간 이내)', '여유 (1-3시간 이내)', '넉넉 (3시간 이상)'];

export type fieldType = 'feel' | 'time';

export interface ICategoryModal {
  field: fieldType;
  onClick: (arg0: string) => void;
  style?: React.CSSProperties;
}

export const itemStyle: React.CSSProperties = {
  padding: '8px 16px',
  paddingRight: 0,
  textAlign: 'left',
  background: 'none',
  border: 'none',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer'
};

export const moods:Record<string, string> = {
  '지치고 무기력해': 'A',
  '답답하고 환기가 필요해': 'B',
  '괜찮아, 가볍게 즐기고 싶어': 'C'
}

export const times:Record<string, string> = {
  '잠깐 (1시간 이내)': 'X',
  '여유 (1-3시간 이내)': 'Y',
  '넉넉 (3시간 이상)': 'Z'
}