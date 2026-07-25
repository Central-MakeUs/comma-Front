import * as styles from './FeedCategoryModal.css';
import { feelCat, bodyStateCat, itemStyle, ICategoryModal } from './Feed.constants';

function CategoryModal({ field, onClick, style }: ICategoryModal) {
  const items = field === 'feel' ? feelCat : bodyStateCat;

  return (
    <div className={styles.chipModal} style={style}>
      {items.map((item) => (
        <button key={item} type="button" style={itemStyle} onClick={() => onClick(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

export default CategoryModal;