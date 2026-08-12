import { SelectButton } from '@comma/design-system';
import { bodyStateCat, type FeedFilterMenuProps, feelCat } from '../model/feed.constants';
import * as styles from './FeedFilterMenu.css';

export function FeedFilterMenu({ field, id, onSelect, style }: FeedFilterMenuProps) {
  const items = field === 'feel' ? feelCat : bodyStateCat;

  return (
    <div
      aria-label={field === 'feel' ? '기분 필터' : '시간 필터'}
      className={styles.menu}
      id={id}
      role="menu"
      style={style}
    >
      {items.map((item) => (
        <SelectButton
          className={styles.optionButton}
          key={item}
          onClick={() => onSelect(item)}
          role="menuitem"
        >
          {item}
        </SelectButton>
      ))}
    </div>
  );
}
