import { bodyStateCat, feelCat, type ICategoryModal, itemStyle } from './Feed.constants';
import * as styles from './FeedCategoryModal.css';

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
